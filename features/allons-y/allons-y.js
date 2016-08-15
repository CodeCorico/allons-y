'use strict';

GLOBAL.DependencyInjection = require('mvw-injection').MVC();

var path = require('path'),
    async = require('async'),
    fork = require('child_process').fork,
    spawn = require('child_process').spawn,
    packageInfos = require(path.resolve(__dirname, '../../package.json'));

module.exports = new (function() {

  require(path.resolve(__dirname, 'allons-y-log.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-glob.js')).apply(this);

  var _this = this;

  function _commands(callback) {
    var files = _this.findInFeaturesSync('*allons-y-bootstrap.js'),
        commands = {},
        help = [];

    async.mapSeries(files, function(file, nextFile) {

      var bootstrapModule = require(path.resolve(file));

      if (!bootstrapModule.commands) {
        return nextFile();
      }

      Object.keys(bootstrapModule.commands).forEach(function(commandName) {
        commands[commandName] = commands[commandName] || [];
        commands[commandName].push(bootstrapModule.commands[commandName].command);

        help = help.concat(bootstrapModule.commands[commandName].help);
      });

      nextFile();

    }, function(err) {
      if (err) {
        throw err;
      }

      callback(commands, help);
    });
  }

  this.bootstrap = function(options, callback) {
    var files = _this.findInFeaturesSync('*allons-y-bootstrap.js');

    async.mapSeries(files, function(file, nextFile) {

      var bootstrapModule = require(path.resolve(file));

      if (!bootstrapModule.bootstrap) {
        return nextFile();
      }

      DependencyInjection.injector.controller.invoke(null, bootstrapModule.bootstrap, {
        controller: {
          $allonsy: function() {
            return _this;
          },

          $options: function() {
            return options;
          },

          $done: function() {
            return nextFile;
          }
        }
      });

    }, function(err) {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  function _startModule(startModule, nextFile) {
    DependencyInjection.injector.controller.invoke(null, startModule.module, {
      controller: {
        $allonsy: function() {
          return _this;
        },

        $done: function() {
          return nextFile;
        }
      }
    });
  }

  this.start = function() {
    _this.bootstrap({
      owner: 'start'
    }, function() {

      var files = _this.findInFeaturesSync('*allons-y-start.js');

      async.mapSeries(files, function(file, nextFile) {
        var startModule = require(path.resolve(file));

        // fork: true,
        // forever: false,
        // watcher: null,

        // $allonsy.glob
        // $allonsy.children

        // var child_process.fork('.js')
        // http://stackoverflow.com/questions/13371113/how-can-i-execute-a-node-js-module-as-a-child-process-of-a-node-js-program

        if (startModule.fork) {
          startModule.forkCount = startModule.forkCount || 1;

          for (var i = 0; i < startModule.forkCount; i++) {
            fork('./node_modules/allons-y/fork.js', [file]);
          }

          return nextFile();
        }
        else if (startModule.spawn) {
          startModule.spawnCount = startModule.spawnCount || 1;
          startModule.spawnAgs = startModule.spawnArgs || [];

          for (var i = 0; i < startModule.spawnCount; i++) {
            spawn(startModule.spawnCommand, startModule.spawnAgs, {
              stdio: 'inherit'
            });
          }

          return nextFile();
        }

        _startModule(startModule, nextFile);
      });
    });
  };

  this.stop = function() {
    _this.bootstrap({
      owner: 'stop'
    }, function() {

      console.log('STOP');
    });
  };

  this.command = function() {
    var commander = require('commander');

    _commands(function(commands, help) {

      commander
        .version(packageInfos.name + ' ' + packageInfos.version, '-v, --version')
        .usage('[options]');

      help.forEach(function(option) {
        commander.option.apply(commander, option);
      });

      commander.parse(process.argv);

      var commandsNames = Object.keys(commands),
          commandFound = false;

      for (var i = 0; i < commandsNames.length; i++) {
        if (commander[commandsNames[i]]) {
          commandFound = commandsNames[i];

          break;
        }
      }

      if (!commandFound) {
        return commander.help();
      }

      async.mapSeries(commands[commandFound], function(command, nextCommand) {

        DependencyInjection.injector.controller.invoke(null, command, {
          controller: {
            $allonsy: function() {
              return _this;
            },

            $commander: function() {
              return commander;
            },

            $done: function() {
              return nextCommand;
            }
          }
        });

      }, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  };

  this.fork = function() {
    _this.bootstrap({
      owner: 'start'
    }, function() {
      if (process.argv.length < 3) {
        return;
      }

      var startModule = require(path.resolve(process.argv[2]));

      _startModule(startModule, function() { });
    });
  };

})();
