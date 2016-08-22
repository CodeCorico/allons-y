'use strict';

module.exports = function() {

  var path = require('path'),
      async = require('async'),
      _this = this;

  this.bootstrap = function(options, callback) {
    var files = _this.findInFeaturesSync('*-allons-y-bootstrap.js');

    _this.log('allons-y', 'bootstrap:' + options.owner, {
      files: files
    });

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

      _this.log('allons-y', 'bootstrap-exec:' + file);

      DependencyInjection.injector.controller.invoke(null, bootstrapModule.bootstrap, {
        controller: {
          $options: function() {
            return options;
          },

          $done: function() {
            return function(err) {
              _this.log('allons-y', 'bootstrap-exec-done:' + file);

              if (err) {
                _this.logError('allons-y', 'bootstrap-exec-error:' + file, {
                  error: err
                });
              }

              nextFile(err);
            };
          }
        }
      });

    }, function(err) {
      if (err) {
        throw err;
      }

      callback(null, files);
    });
  };

};
