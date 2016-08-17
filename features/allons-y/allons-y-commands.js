'use strict';

module.exports = function() {

  var path = require('path'),
      async = require('async'),
      _this = this,
      packageInfos = require(path.resolve(__dirname, '../../package.json'));

  this.liveCommand(['version', 'v'], 'output allons-y version', function() {
    _this.logInfo('\n► version:\n\n');
    console.log('  ' + packageInfos.name + ' ' + packageInfos.version + '\n');
  });

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

};
