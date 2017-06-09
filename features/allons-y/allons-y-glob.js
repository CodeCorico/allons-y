'use strict';

var glob = require('glob'),
    async = require('async'),
    path = require('path'),
    fs = require('fs-extra');

module.exports = function() {

  var _this = this,
      _extraModulesPaths = '';

  ['.allons-y-paths', '.allons-y-paths-dev'].forEach(function(fileName) {
    _extraModulesPaths += '\n' + (fs.existsSync(fileName) ? fs.readFileSync(fileName, 'utf-8') : '');
  });

  _extraModulesPaths = _extraModulesPaths.split('\n');

  function _sortByFilePriority(a, b) {
    a = a.split('/').pop();
    b = b.split('/').pop();

    var priorities = [50, 50],
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

    if (priorities[1] < priorities[0]) {
      return -1;
    }

    if (priorities[1] > priorities[0]) {
      return 1;
    }

    return 0;
  }

  DependencyInjection.service('$glob', function() {
    return glob;
  });

  this.globPatterns = function(pattern) {
    var patterns = ['./node_modules/allons-y*/features/*/' + pattern];

    if (_extraModulesPaths.length) {
      _extraModulesPaths.forEach(function(extraModule) {
        if (!extraModule) {
          return;
        }

        patterns.push(extraModule + '/features/*/' + pattern);
      });
    }

    patterns.push('./features/*/' + pattern);

    return patterns;
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

  this.requireInFeatures = function(file, execute) {
    execute = typeof execute != 'boolean' ? true : execute;

    if (['js', 'json'].indexOf(file.split('.').pop()) < 0) {
      file += '.js';
    }

    var files = _this.findInFeaturesSync(file),
        modules = [];

    files.forEach(function(file) {
      var fileModule = require(path.resolve(file));

      if (execute) {
        fileModule();
      }

      modules.push(fileModule);
    });

    if (!modules.length) {
      return null;
    }

    if (modules.length == 1) {
      return modules[0];
    }

    return modules;
  };

};
