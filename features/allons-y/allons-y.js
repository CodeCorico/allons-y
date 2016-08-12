'use strict';

GLOBAL.DependencyInjection = require('mvw-injection').MVC();

var path = require('path'),
    async = require('async'),
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

  function _bootstrap(options, callback) {
    var files = _this.findInFeaturesSync('*allons-y-bootstrap.js');

    async.mapSeries(files, function(file, nextFile) {

      var bootstrapModule = require(path.resolve(file));

      if (!bootstrapModule.bootstrap) {
        return nextFile();
      }

      bootstrapModule.bootstrap(_this, options, nextFile);

    }, function(err) {
      if (err) {
        throw err;
      }

      callback();
    });
  }

  this.start = function() {
    console.log('BEFORE START');

    _bootstrap({
      owner: 'start'
    }, function() {

      console.log('START');

      var files = _this.findInFeaturesSync('*allons-y-start.js');

      files.forEach(function(file) {
        var startModule = require(path.resolve(file));

        // fork: true,
        // forever: false,
        // watcher: null,

        // $allonsy.glob
        // $allonsy.children

        // var child_process.fork('.js')
        // http://stackoverflow.com/questions/13371113/how-can-i-execute-a-node-js-module-as-a-child-process-of-a-node-js-program

        DependencyInjection.injector.controller.invoke(null, startModule.module);
      });
    });
  };

  this.stop = function() {
    console.log('BEFORE STOP');

    _bootstrap({
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
        command(_this, commander, nextCommand);
      }, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  };

})();
