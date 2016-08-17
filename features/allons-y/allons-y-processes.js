'use strict';

module.exports = function() {

  var path = require('path'),
      fs = require('fs'),
      async = require('async'),
      forever = require('forever-monitor'),
      pidsPath = path.resolve(__dirname, '../../.pids'),
      _this = this,
      _children = [{
        name: 'Allons-y',
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

    if (pids.length && !pids[0]) {
      pids.splice(0, 1);
    }

    return pids;
  }

  function _keepPid(pid) {
    var pids = fs.existsSync(pidsPath) ? fs.readFileSync(pidsPath, 'utf-8') : '';
    pids += (pids ? '\n' : '') + pid;

    fs.writeFileSync(pidsPath, pids);
  }

  _this.liveCommand(['processes', 'p'], 'output the live processes list', function() {
    _this.logInfo('\n► processes:\n\n');

    _children.forEach(function(child, i) {
      console.log([
        '  ■ [' + _logDate(child.startDate) + ']',
        _this.textInfo(child.name),
        (child.processes ? '(' + child.processes.length + ')' : ''),
        '#' + _this.textWarning(i)
      ].join(' '));

      if (child.processes) {
        child.processes.forEach(function(p, j) {
          console.log([
            '    ∙ [' + _logDate(p.restartDate) + ']',
            _this.textInfo(p.name),
            '(' + child.type + ')',
            '(' + p.forever.times + ' restarts)',
            '#' + _this.textWarning(i + '.' + j)
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

      if (i.toString() === id) {
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
          if (i.toString() + '.' + j.toString() === id) {
            found = {
              id: id,
              name: child.processes[j].name,
              processes: [child.processes[j]]
            };

            if (splice) {
              child.processes.splice(j, 1);
            }

            break;
          }
        }
      }
    }

    return found === false ? -1 : found;
  }

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

      console.log('before', p.forever.child.pid);

      if (p.forever) {
        p.forever.restart();
      }

      console.log('after', p.forever.child.pid);
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
        }
      }
    }

    _cleanPids();

    process.exit();
  });

  function _callModule(startModule, nextFile) {
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

  function _processEvents(p) {
    p.forever.on('restart', function() {
      p.restartDate = new Date();
    });

    _keepPid(p.forever.child.pid);
  }

  this.start = function(dontStopBefore) {
    if (!dontStopBefore) {
      return _this.stop(function() {
        _this.start(true);
      }, true);
    }

    _this.logBanner();

    _keepPid(process.pid);

    if (!process.env.LIVE_COMMANDS || process.env.LIVE_COMMANDS == 'true') {
      _this.logInfo('  Live Commands is enabled. Use "help" to display the available commands.\n\n');
    }

    _this.bootstrap({
      owner: 'start'
    }, function() {

      var files = _this.findInFeaturesSync('*allons-y-start.js');

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
                type: startModule.fork ? 'fork' : 'spawn',
                startDate: new Date(),
                processes: []
              };

          for (var i = 0; i < count; i++) {
            _this.logInfo('► Starting "' + child.name + '" (' + child.type + ')' + ' [' + (i + 1) + '/' + count + ']\n');

            var p = {
              name: child.name,
              startDate: new Date(),
              restartDate: new Date(),
              forever: startModule.fork ?
                new (forever.Monitor)('./node_modules/allons-y/fork.js', {
                  max: startModule.forkMaxRestarts,
                  args: [file]
                }) :
                forever.start(startModule.spawnCommands, {
                  max: startModule.spawnMaxRestarts
                })
            };

            _processEvents(p);

            child.processes.push(p);
          }

          _children.push(child);

          return nextFile();
        }

        _callModule(startModule, nextFile);
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
          _this.logSuccess('  kill PID ' + pid + '\n');
        }

        forever.kill(pid);
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
      if (process.argv.length < 3) {
        return;
      }

      var startModule = require(path.resolve(process.argv[2]));

      _callModule(startModule, function() { });
    });
  };

};
