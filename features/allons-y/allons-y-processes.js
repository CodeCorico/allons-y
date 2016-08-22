'use strict';

module.exports = function() {

  var path = require('path'),
      fs = require('fs'),
      async = require('async'),
      forever = require('forever-monitor'),
      pidsPath = path.resolve(__dirname, '../../.pids'),
      _this = this,
      _ids = -1,
      _children = [{
        name: 'Allons-y',
        id: ++_ids,
        type: 'main',
        startDate: new Date()
      }];

  function _logDate(date) {
    if (!date) {
      return '';
    }

    var day = date.getDate(),
        month = date.getMonth() + 1,
        hours = date.getHours(),
        minutes = date.getMinutes();

    return (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + ' ' +
        (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  }

  function _cleanPids() {
    if (fs.existsSync(pidsPath)) {
      try {
        fs.unlinkSync(pidsPath);
      }
      catch (ex) {}
    }
  }

  function _pids() {
    var pids = (fs.existsSync(pidsPath) ? fs.readFileSync(pidsPath, 'utf-8') : '').split('\n');

    for (var i = pids.length - 1; i >= 0; i--) {
      if (!pids[i]) {
        pids.splice(i, 1);
      }
      else {
        pids[i] = pids[i].split(':');
      }
    }

    return pids;
  }

  function _keepPid(pid, processName) {
    if (!pid || !processName) {
      return false;
    }

    var pids = fs.existsSync(pidsPath) ? fs.readFileSync(pidsPath, 'utf-8') : '';
    pids += (pids ? '\n' : '') + pid + ':' + processName;

    fs.writeFileSync(pidsPath, pids);

    return true;
  }

  _this.liveCommand(['processes', 'p'], 'output the live processes list', function() {
    _this.logInfo('\n► processes:\n\n');

    _children.forEach(function(child) {
      console.log([
        '  ■ [' + _logDate(child.startDate) + ']',
        _this.textInfo(child.name),
        (child.processes ? '(' + child.processes.length + ')' : ''),
        '#' + _this.textWarning(child.id)
      ].join(' '));

      if (child.processes) {
        child.processes.forEach(function(p) {
          console.log([
            '    ∙ [' + _logDate(p.restartDate) + ']',
            _this.textInfo(p.name),
            '(' + child.type + ')',
            '(' + p.forever.times + ' restarts)',
            '#' + _this.textWarning(p.id)
          ].join(' '));
        });
      }
    });

    console.log('');
  });

  function _findProcesses($args, splice) {
    $args = $args || [];
    $args[0] = ($args[0] || '')
      .toString()
      .replace('#', '');

    if (!$args[0]) {
      return null;
    }

    var id = $args[0],
        found = false;

    if (id.indexOf('0') === 0) {
      return false;
    }

    for (var i = 0; i < _children.length; i++) {
      var child = _children[i];

      if (child.id.toString() === id) {
        found = {
          id: id,
          name: child.name,
          processes: child.processes
        };

        if (splice) {
          _children.splice(i, 1);
        }

        break;
      }

      if (child.processes) {
        for (var j = 0; j < child.processes.length; j++) {
          if (child.processes[j].id.toString() === id) {
            found = {
              id: id,
              name: child.processes[j].name,
              processes: [child.processes[j]]
            };

            if (splice) {
              child.processes.splice(j, 1);
            }

            if (!child.processes.length) {
              _children.splice(i, 1);
            }

            break;
          }
        }
      }
    }

    return found === false ? -1 : found;
  }

  this.childByName = function(name) {
    for (var i = 0; i < _children.length; i++) {
      console.log(name, _children[i]);
      if (_children[i].name == name) {
        return _children[i];
      }
    }

    return null;
  };

  _this.liveCommand('restart [process]', 'restart a process', function($args) {
    _this.logInfo('\n► restart:\n\n');

    var found = _findProcesses($args);

    if (found === null) {
      return _this.logWarning('\n  Set a process id for the "restat" command: restart [process]\n\n');
    }
    else if (found === false) {
      return _this.logWarning('\n  You cannot restart Allons-y from the Live Commands\n\n');
    }
    else if (found === -1 || !found.processes) {
      return _this.logWarning('\n  There is no process for this id\n\n');
    }

    for (var i = 0; i < found.processes.length; i++) {
      var p = found.processes[i];

      if (p.forever) {
        p.forever.restart();
      }
    }

    _this.logSuccess('\n► process "' + found.name + '" (#' + found.id + ') restarted\n\n');
  });

  _this.liveCommand('kill [process]', 'shutdown a process', function($args) {
    _this.logInfo('\n► kill:\n\n');

    var found = _findProcesses($args, true);

    if (found === null) {
      return _this.logWarning('\n  Set a process id for the "kill" command: kill [process]\n\n');
    }
    else if (found === false) {
      return _this.logWarning('\n  Use the "exit" command to shutdown Allons-y\n\n');
    }
    else if (found === -1 || !found.processes) {
      return _this.logWarning('\n  There is no process for this id\n\n');
    }

    found.processes.forEach(function(p) {
      if (p.forever) {
        p.forever.stop();
      }
      if (p.watcher) {
        p.watcher.stop();
      }
    });

    _this.logSuccess('\n► process "' + found.name + '" (#' + found.id + ') terminated\n\n');
  });

  _this.liveCommand('exit', 'shutdown allons-y', function() {
    _this.logInfo('\n► exit\n\n');

    for (var i = 0; i < _children.length; i++) {
      var child = _children[i];

      if (child.processes && child.processes.length) {
        for (var j = 0; j < child.processes.length; j++) {
          if (child.processes[j].forever) {
            child.processes[j].forever.stop();
          }
          if (child.processes[j].watcher) {
            child.processes[j].watcher.stop();
          }
        }
      }
    }

    _cleanPids();

    process.exit();
  });

  function _callModule(startModule, index, nextFile) {
    index = parseInt(index, 10);

    DependencyInjection.injector.controller.invoke(null, startModule.module, {
      controller: {
        $index: function() {
          return index;
        },

        $done: function() {
          return nextFile;
        }
      }
    });
  }

  function _processEvents(p) {
    p.forever.on('restart', function() {
      p.restartDate = new Date();
    });

    p.forever.on('exit', function() {
      _findProcesses([p.id], true);
    });

    p.forever.on('watch:restart', function() {
      p.restartDate = new Date();
      _this.logInfo('► [Watch] Restart "' + p.name + '" (#' + _this.logWarning(p.id) + ')\n');
    });

    p.watcher.on('change', function() {
      _this.logInfo('► [Watch] Restart "' + p.name + '" (#' + p.id + ')\n');
      p.forever.times--;
      p.forever.restart();
    });

    _keepPid(p.forever.child.pid, p.name);
  }

  this.start = function(dontStopBefore) {
    if (!dontStopBefore) {
      return _this.stop(function() {
        _this.start(true);
      }, true);
    }

    _this.logBanner();

    _keepPid(process.pid, 'Allons-y');

    if (!process.env.ALLONSY_LIVE_COMMANDS || process.env.ALLONSY_LIVE_COMMANDS == 'true') {
      _this.logInfo('  Live Commands is enabled. Use "help" to display the available commands.\n\n');
    }

    _this.bootstrap({
      owner: 'start'
    }, function() {

      var files = _this.findInFeaturesSync('*-allons-y-start.js');

      async.mapSeries(files, function(file, nextFile) {
        var startModule = require(path.resolve(file));

        if (typeof startModule.enabled == 'boolean' && startModule.enabled === false) {
          return nextFile();
        }

        if (startModule.fork || startModule.spawn) {
          if (startModule.fork) {
            startModule.forkCount = startModule.forkCount || 1;
            startModule.forkMaxRestarts = startModule.forkMaxRestarts || 10;
          }
          else if (startModule.spawn) {
            startModule.spawnCount = startModule.spawnCount || 1;
            startModule.spawnArgs = startModule.spawnArgs || [];
            startModule.spawnMaxRestarts = startModule.spawnMaxRestarts || 10;
          }

          var count = startModule.fork ? startModule.forkCount : startModule.spawnCount,
              child = {
                name: startModule.name,
                id: ++_ids,
                ids: -1,
                type: startModule.fork ? 'fork' : 'spawn',
                startDate: new Date(),
                processes: []
              };

          _children.push(child);

          for (var i = 0; i < count; i++) {
            _this.logInfo('► Starting "' + child.name + '" (' + child.type + ')' + ' [' + (i + 1) + '/' + count + ']\n');

            var p = {
              name: child.name,
              id: child.id + '.' + (++child.ids),
              startDate: new Date(),
              restartDate: new Date(),
              watcher: _this.watcher(startModule.name, startModule.watch || null),
              forever: startModule.fork ?
                new (forever.Monitor)('./node_modules/allons-y/fork.js', {
                  max: startModule.forkMaxRestarts,
                  args: [file, i]
                }).start() :
                forever.start(startModule.spawnCommands, {
                  max: startModule.spawnMaxRestarts
                })
            };

            _processEvents(p);

            child.processes.push(p);
          }

          return nextFile();
        }

        _callModule(startModule, 0, nextFile);
      }, function() {

        _this.waitLiveCommand();

      });
    });
  };

  this.stop = function(callback, fromStart) {
    _this.bootstrap({
      owner: 'stop'
    }, function() {
      var pids = _pids();

      if (!fromStart) {
        _this.logBanner();

        _this.logInfo('► stop\n\n');
      }

      pids.forEach(function(pid) {
        if (!pid) {
          return;
        }

        if (!fromStart) {
          _this.logSuccess('  kill "' + pid[1] + '" (#' + pid[0] + ')\n');
        }

        forever.kill(pid[0]);
      });

      _cleanPids();

      if (!fromStart) {
        console.log('');
      }

      if (callback) {
        callback();
      }
    });
  };

  this.fork = function() {
    _this.bootstrap({
      owner: 'fork'
    }, function() {
      if (process.argv.length < 4) {
        return;
      }

      var startModule = require(path.resolve(process.argv[2]));

      _callModule(startModule, process.argv[3], function() { });
    });
  };

};
