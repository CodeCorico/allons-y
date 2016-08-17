'use strict';

module.exports = function() {

  var path = require('path'),
      async = require('async'),
      _this = this;

  this.bootstrap = function(options, callback) {
    var files = _this.findInFeaturesSync('*allons-y-bootstrap.js');

    async.mapSeries(files, function(file, nextFile) {

      var bootstrapModule = require(path.resolve(file));

      if (bootstrapModule.liveCommands) {
        bootstrapModule.liveCommands.forEach(function(liveCommand) {
          _this.liveCommand(liveCommand.commands, liveCommand.description, liveCommand.action);
        });
      }

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

};
