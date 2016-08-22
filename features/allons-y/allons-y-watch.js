'use strict';

module.exports = function() {

  var chokidar = require('chokidar'),
      EventsManager = require('events-manager').EventsManager,
      _this = this,
      _processes = {};

  this.watcher = function(processName, patterns) {
    if (!_processes[processName]) {
      _processes[processName] = new _this.Watcher(processName);
    }

    _processes[processName].add(patterns);

    return _processes[processName];
  };

  this.Watcher = function(processName) {

    EventsManager.call(this);

    var _watcher = this,
        _enabled = process.env.ALLONSY_WATCHER && process.env.ALLONSY_WATCHER == 'true' || false,
        _patterns = [],
        _patternsOrigin = [],
        _chokidarWatcher = null;

    function _init() {
      if (!_enabled || !_patterns.length) {
        return;
      }

      _chokidarWatcher = chokidar.watch(_patterns, {
        persistent: true
      });

      _chokidarWatcher.on('change', function(path, stats) {
        _watcher.fire('change', {
          path: path,
          stats: stats
        });
      });
    }

    this.add = function(newPatterns) {
      newPatterns = newPatterns && typeof newPatterns == 'string' ? [newPatterns] : newPatterns;

      if (!newPatterns || !newPatterns.length) {
        return;
      }

      var newPatternsFormatted = [];

      newPatterns.forEach(function(pattern) {
        if (_patternsOrigin.indexOf(pattern) > -1) {
          return;
        }
        _patternsOrigin.push(pattern);

        newPatternsFormatted = newPatternsFormatted.concat(_this.globPatterns(pattern));
      });

      _patterns = _patterns.concat(newPatternsFormatted);

      if (!_patterns.length) {
        return;
      }

      if (!_chokidarWatcher) {
        _init();
      }
      else {
        _chokidarWatcher.add(newPatternsFormatted);
      }
    };

    this.stop = function() {
      if (_chokidarWatcher) {
        _chokidarWatcher.close();
      }
    };
  };

};
