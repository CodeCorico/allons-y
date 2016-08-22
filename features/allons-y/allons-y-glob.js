'use strict';

var glob = require('glob'),
    async = require('async');

module.exports = function() {

  var _this = this;

  function _sortByFilePriority(a, b) {
    a = a.split('/').pop();
    b = b.split('/').pop();

    var priorities = [99999, 99999],
        files = [a.split('-'), b.split('-')],
        priority = null;

    for (var i = 0; i < files.length; i++) {
      for (var j = 0; j < files[i].length; j++) {
        priority = parseFloat(files[i][j]);
        if (!isNaN(priority)) {
          priorities[i] = priority;
          break;
        }
      }
    }

    if (priorities[0] < priorities[1]) {
      return -1;
    }

    if (priorities[0] > priorities[1]) {
      return 1;
    }

    return 0;
  }

  this.globPatterns = function(pattern) {
    return [
      './features/**/' + pattern,
      './node_modules/allons-y*/features/**/' + pattern
    ];
  };

  this.globSortered = function(patterns, callback) {
    var files = [],
        error = null;

    async.mapSeries(patterns, function(pattern, nextPattern) {

      glob.sync(pattern, {
        nosort: true
      }, function(err, newFiles) {
        if (err || !newFiles || !newFiles.length) {
          error = err ? err : error;

          return nextPattern();
        }

        files = files.concat(newFiles);

        files.sort(_sortByFilePriority);

        nextPattern();
      });
    }, function() {
      if (error) {
        return callback(error);
      }

      files.sort(_sortByFilePriority);

      callback(null, files);
    });
  };

  this.globSyncSortered = function(patterns) {
    var files = [];

    patterns.forEach(function(pattern) {
      var newFiles = glob.sync(pattern, {
        nosort: true
      });

      if (newFiles && newFiles.length) {
        files = files.concat(newFiles);
      }
    });

    files.sort(_sortByFilePriority);

    return files;
  };

  this.findInFeatures = function(pattern, callback) {
    _this.globSortered(_this.globPatterns(pattern), callback);
  };

  this.findInFeaturesSync = function(pattern) {
    return _this.globSyncSortered(_this.globPatterns(pattern));
  };

};
