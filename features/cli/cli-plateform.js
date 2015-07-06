module.exports = new (function Plateform() {
  'use strict';

  var ALLONSY_RC_FILE = '.allonsyrc',
      ENV_FILE = '.env',
      CLI_SEARCH = '../**/*-cli.js',
      ENV_SEARCH = './features/**/*-env.json',

      _this = this,
      utils = require('./cli-utils'),
      extend = require('extend'),
      fs = require('fs'),
      path = require('path'),
      spawn = require('child_process').spawn,
      inquirer = require('inquirer'),
      glob = require('glob'),
      async = require('async'),
      jsonfile = require('jsonfile'),
      semver = require('semver'),
      dotenv = require('dotenv'),
      allonsyrcFile = path.resolve(utils.path, ALLONSY_RC_FILE),
      envFile = path.resolve(utils.path, ENV_FILE),
      cliFiles = path.resolve(__dirname, CLI_SEARCH),
      envJsonFiles = path.resolve(utils.path, ENV_SEARCH),
      packageFile = path.resolve(utils.path, 'package.json');

  function _config() {
    var config = {
      version: '0.0.0',
      package: {},
      install: {},
      env: {}
    };

    if (fs.existsSync(allonsyrcFile)) {
      config = extend(true, config, jsonfile.readFileSync(allonsyrcFile));
    }

    if (fs.existsSync(packageFile)) {
      config.package = jsonfile.readFileSync(packageFile);
    }

    if (fs.existsSync(envFile)) {
      config.env = dotenv.parse(fs.readFileSync(envFile));
      Object.keys(config.env).forEach(function(key) {
        config.env[key] = config.env[key] == 'true' ? true : config.env[key];
        config.env[key] = config.env[key] == 'false' ? false : config.env[key];
      });
    }

    return config;
  }

  function _saveConfig(config) {
    delete config.package;
    delete config.env;
    jsonfile.writeFileSync(allonsyrcFile, config);
  }

  function _cliPrompt(config, promptType, forcePrompt, tasksFunc) {
    var files = glob.sync(cliFiles),
        tasks = [],
        hasPrompt = false;

    async.mapSeries(files, function(file, next) {
      var task = require(file),
          item;

      tasks.push(task);

      if (promptType && task[promptType] && task[promptType].length) {
        var prompts = [];

        if (forcePrompt) {
          prompts = task[promptType];
          hasPrompt = true;
        }
        else {
          prompts = [];
          var keys = Object.keys(config[promptType]);

          task[promptType].forEach(function(prompt) {
            var exists = false;

            keys.forEach(function(key) {
              if (key == prompt.name) {
                exists = true;

                return false;
              }
            });

            if (!exists) {
              prompts.push(prompt);
            }
          });

          if (!prompts.length) {
            return next();
          }

          hasPrompt = true;
        }

        var loopSeries = [];

        var firstSeries = prompts.filter(function(prompt) {
          if (typeof config[promptType][prompt.name] != 'undefined') {
            prompt.default = config[promptType][prompt.name];
          }

          if (!prompt.loop) {
            return prompt;
          }
          else {
            loopSeries.push(prompt);
          }
        });

        inquirer.prompt(firstSeries, function(values) {
          for (item in values) {
            config[promptType][item] = values[item];
          }

          if (loopSeries.length) {
            var secondSeries = [],
                secondSeriesSorting = {};

            loopSeries.forEach(function(prompt) {
              secondSeriesSorting[prompt.loop] = secondSeriesSorting[prompt.loop] || [];

              var length = parseInt(config[promptType][prompt.loop], 10);

              for (var i = 0; i < length; i++) {
                secondSeriesSorting[prompt.loop][i] = secondSeriesSorting[prompt.loop][i] || [];

                var newPrompt = extend(true, {}, prompt);
                newPrompt.name += '_' + i;
                newPrompt.message = newPrompt.message
                  .replace(/{{index}}/g, i)
                  .replace(/{{index1}}/g, i + 1)
                  .replace(/{{length}}/g, length);

                if (typeof config[promptType][newPrompt.name] != 'undefined') {
                  newPrompt.default = config[promptType][newPrompt.name];
                }

                secondSeriesSorting[prompt.loop][i].push(newPrompt);
              }
            });

            Object.keys(secondSeriesSorting).forEach(function(key) {
              for (var i = 0; i < secondSeriesSorting[key].length; i++) {
                secondSeries = secondSeries.concat(secondSeriesSorting[key][i]);
              }
            });

            inquirer.prompt(secondSeries, function(values) {
              for (item in values) {
                config[promptType][item] = values[item];
              }

              next();
            });
          }
          else {
            next();
          }
        });

        return;
      }

      next();

    }, function() {

      if (tasksFunc) {
        tasksFunc(tasks, hasPrompt);
      }
    });
  }

  this.create = function(force, useNpm, isUpdate) {
    isUpdate = isUpdate || false;

    var config = _config();

    if (!force && !semver.lt(config.version, utils.package.version)) {
      return utils.success('\nYour Allons-y! configuration (' + utils.package.version + ') is up to date!\n');
    }

    config.version = utils.package.version;

    utils.banner([
      'You are going to ' + (!isUpdate ? 'create a' : 'update your') + ' Allons-y! platform (' + utils.package.version + ').\n',
      'Please answer the few questions below to configure your install:\n'
    ]);

    _cliPrompt(config, 'install', false, function(tasks, hasPrompt) {

      if (!hasPrompt) {
        utils.success('No new question to ask.\n');
      }

      utils.info('\nNow let\'s ' + (!isUpdate ? 'create' : 'update') + ' the webapp!\n\n');

      async.mapSeries(tasks, function(task, next) {

        if (task.beforeInstall) {
          task.beforeInstall(config, utils, next);
        }
        else {
          next();
        }

      }, function() {

        utils.log('► ' + (!isUpdate ? 'Create' : 'Update') + ' npm package file... ');

        jsonfile.writeFileSync(packageFile, config.package);

        utils.log('[OK]');

        var npmCommands = ['npm'];
        if (!isUpdate) {
          npmCommands.push('install');
        }
        else {
          npmCommands = npmCommands.concat(['update', '--save']);
        }

        var installProcess = {
          on: function(name, func) {
            func();
          }
        };

        if (useNpm) {
          utils.info('\n\n' + (!isUpdate ? 'Install' : 'Update') + ' your dependencies:\n\n');

          installProcess = spawn('env', npmCommands, {
            cwd: utils.path,
            stdio: 'inherit'
          });

          installProcess.on('error', function(err) {
            throw err;
          });
        }

        installProcess.on('close', function() {

          utils.info('\n\nConfigure installed features\n\n');

          async.mapSeries(tasks, function(task, next) {

            if (task.afterInstall) {
              task.afterInstall(config, utils, next);
            }
            else {
              next();
            }

          }, function() {

            utils.log('► Save configuration... ');

            _saveConfig(config);

            utils.log('[OK]');

            utils.title('Your platform "' + config.install.name + '" is ' + (!isUpdate ? 'ready!\n\n    Now use "allons-y env" to configure you environment.' : 'up to date!'));
          });
        });
      });
    });
  };

  this.update = function(force, useNpm) {
    _this.create(force, useNpm, true);
  };

  this.configure = function() {

  };

  this.env = function() {
    var config = _config();

    utils.banner('Configure your Allons-y! platform (' + utils.package.version + ') environment:\n');

    _cliPrompt(config, 'env', true, function() {

      var files = glob.sync(envJsonFiles);

      async.mapSeries(files, function(file, next) {

        var envConfig = require(file);

        if (envConfig.env && typeof envConfig.env == 'object' && envConfig.env.length) {

          envConfig.env.map(function(prompt) {
            if (typeof config.env[prompt.name] != 'undefined') {
              prompt.default = config.env[prompt.name];
            }
          });

          inquirer.prompt(envConfig.env, function(values) {
            for (var item in values) {
              config.env[item] = values[item];
            }

            next();
          });

          return;
        }

        next();

      }, function() {

        utils.log('\n► Save configuration... ');

        fs.writeFileSync(envFile, Object.keys(config.env).map(function(key) {
          return key + '=' + config.env[key];
        }).join('\n'));

        utils.log('[OK]');

        utils.title('Your platform environment is ready!');
      });
    });
  };

})();
