'use strict';

module.exports = function() {

  var path = require('path'),
      fs = require('fs'),
      async = require('async'),
      forever = require('forever-monitor'),
      uuid = require('node-uuid'),
      stream = require('stream'),
      pidsPath = path.resolve(__dirname, '../../.pids'),
      _this = this,
      _isMain = false,
      _isFork = false,
      _ids = -1,
      _messagesCallbacks = {},
      _children = [{
        name: 'Allons-y',
        id: ++_ids,
        type: 'main',
        startDate: new Date()
      }],
      childrenStdout = new stream.Writable();

  childrenStdout._write = function(data, encoding, callback) {
    data = data.toString();

    _this.output(data);

    callback();
  };

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
        _this.log('allons-y', 'processes-clean-pids');

        fs.unlinkSync(pidsPath);
      }
      catch (err) {
        _this.logWarning('allons-y', 'processes-clean-pids-error', {
          error: err
        });
      }
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

  function _savePid(pid, processName) {
    if (!pid || !processName) {
      return false;
    }

    _this.log('allons-y', 'processes-pid-save:' + pid + ',' + processName);

    var pids = fs.existsSync(pidsPath) ? fs.readFileSync(pidsPath, 'utf-8') : '';
    pids += (pids ? '\n' : '') + pid + ':' + processName;

    fs.writeFileSync(pidsPath, pids);

    return true;
  }

  _this.liveCommand(['processes', 'p'], 'output the live processes list', function() {
    _this.outputInfo('► processes:\n');

    _children.forEach(function(child) {
      _this.output([
        '  ■ [' + _logDate(child.startDate) + ']',
        _this.textInfo(child.name),
        (child.processes ? '(' + child.processes.length + ')' : ''),
        '#' + _this.textWarning(child.id)
      ].join(' '), '\n');

      if (child.processes) {
        child.processes.forEach(function(p) {
          _this.output([
            '    ∙ [' + _logDate(p.restartDate) + ']',
            _this.textInfo(p.name),
            '(' + child.type + ')',
            '(' + p.forever.times + ' restarts)',
            '#' + _this.textWarning(p.id)
          ].join(' '), '\n');
        });
      }
    });
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
      if (_children[i].name == name) {
        return _children[i];
      }
    }

    return null;
  };

  this.sendMessage = function(message, callback) {
    message = message || {};
    message = typeof message == 'object' ? message : {
      event: message
    };

    if (callback) {
      message.messageId = uuid.v1();
      _messagesCallbacks[message.messageId] = callback;
    }

    if (_isMain) {
      _children.forEach(function(child) {
        if (!child.processes) {
          return;
        }

        child.processes.forEach(function(p) {
          p.forever.send(message);
        });
      });
    }
    else if (_isFork) {
      process.send(message);
    }
  };

  _this.liveCommand('restart [process]', 'restart a process', function($args) {
    _this.outputInfo('► restart:\n');

    var found = _findProcesses($args);

    if (found === null) {
      return _this.outputWarning('  Set a process id for the "restart" command: restart [process]');
    }
    else if (found === false) {
      return _this.outputWarning('  You cannot restart Allons-y from the Live Commands');
    }
    else if (found === -1 || !found.processes) {
      return _this.outputWarning('  There is no process for this id');
    }

    for (var i = 0; i < found.processes.length; i++) {
      var p = found.processes[i];

      if (p.forever) {
        _this.log('allons-y', 'processes-restart:' + p.id + ',' + p.name);

        p.forever.restart();
      }
    }

    _this.outputSuccess('► process "' + found.name + '" (#' + found.id + ') restarted');
  });

  _this.liveCommand('kill [process]', 'shutdown a process', function($args) {
    _this.outputInfo('► kill:\n');

    var found = _findProcesses($args, true);

    if (found === null) {
      return _this.outputWarning('  Set a process id for the "kill" command: kill [process]');
    }
    else if (found === false) {
      return _this.outputWarning('  Use the "exit" command to shutdown Allons-y');
    }
    else if (found === -1 || !found.processes) {
      return _this.outputWarning('  There is no process for this id');
    }

    found.processes.forEach(function(p) {
      // Kill doesn't works on Linux without this
      p.forever.killTree = false;

      if (p.watcher) {
        p.watcher.stop();
      }
      if (p.forever) {
        _this.log('allons-y', 'processes-stop:' + p.id + ',' + p.name);

        p.forever.stop();
      }
    });

    _this.outputSuccess('\n► process "' + found.name + '" (#' + found.id + ') terminated');
  });

  _this.liveCommand('exit', 'shutdown allons-y', function() {
    _this.outputInfo('► exit');

    for (var i = 0; i < _children.length; i++) {
      var child = _children[i];

      if (child.processes && child.processes.length) {
        for (var j = 0; j < child.processes.length; j++) {
          // Kill doesn't works on Linux without this
          child.processes[j].forever.killTree = false;

          if (child.processes[j].watcher) {
            child.processes[j].watcher.stop();
          }
          if (child.processes[j].forever) {
            _this.log('allons-y', 'processes-stop:' + child.processes[j].id + ',' + child.processes[j].name);

            child.processes[j].forever.stop();
          }
        }
      }
    }

    _cleanPids();

    _this.log('allons-y', 'exit');

    _this.cleanPrompt();

    process.exit();
  });

  function _callModule(startModule, callback) {
    DependencyInjection.injector.controller.invoke(null, startModule.module, {
      controller: {
        $done: function() {
          return callback || function() {};
        }
      }
    });
  }

  function _messageReceived(message, child, p) {
    message = typeof message == 'object' ? message : {
      event: message
    };

    if (child) {
      message.child = child;
      message.p = p;
    }

    if (message.messageId && _messagesCallbacks[message.messageId]) {
      _messagesCallbacks[message.messageId](message);

      delete _messagesCallbacks[message.messageId];
    }

    _this.fire('message', message);
  }

  function _processChildEvents(p) {
    p.forever.child.stdout.pipe(childrenStdout, {
      end: false
    });

    p.forever.child.stderr.pipe(childrenStdout, {
      end: false
    });
  }

  function _processEvents(p, child) {
    p.forever.on('restart', function() {
      p.restartDate = new Date();
    });

    p.forever.on('exit', function() {
      _findProcesses([p.id], true);
    });

    p.forever.on('watch:restart', function() {
      p.restartDate = new Date();
      _this.outputInfo('► [Watch] Restart "' + p.name + '" (#' + _this.outputWarning(p.id) + ')');
    });

    p.forever.on('message', function(message) {
      _messageReceived(message, child, p);
    });

    p.forever.on('restart', function() {
      _processChildEvents(p);
    });

    p.watcher.on('change', function() {
      _this.outputInfo('► [Watch] Restart "' + p.name + '" (#' + p.id + ')');
      p.forever.times--;
      p.forever.restart();
    });

    _processChildEvents(p);

    _savePid(p.forever.child.pid, p.name);
  }

  process.on('message', _messageReceived);

  this.start = function(dontStopBefore) {
    _isMain = true;

    if (!dontStopBefore) {
      return _this.stop(function() {
        _this.start(true);
      }, true);
    }

    _this.startLiveCommand();

    _this.outputBanner();

    _savePid(process.pid, 'Allons-y');

    if (!process.env.ALLONSY_LIVE_COMMANDS || process.env.ALLONSY_LIVE_COMMANDS == 'true') {
      _this.outputSuccess('  Live Commands is enabled. Use "help" to display the available commands.\n');
    }

    _this.bootstrap({
      owner: 'start'
    }, function() {
      var files = _this.findInFeaturesSync('*-allons-y-start.js');

      _this.log('allons-y', 'start', {
        files: files
      });

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
            var pId = child.id + '.' + (++child.ids);

            _this.log('allons-y', 'processes-' + child.type + '-start:' + pId + ',' + child.name);

            _this.outputInfo('► Starting "' + child.name + '" (' + child.type + ')' + (count > 1 ? ' [' + (i + 1) + '/' + count + ']' : ''));

            if (
              !startModule.fork && process.platform == 'win32' &&
              startModule.spawnCommands.length && startModule.spawnCommands[0].indexOf('"') !== 0
            ) {
              startModule.spawnCommands[0] = '"' + startModule.spawnCommands[0] + '"';
            }

            var p = {
              name: child.name,
              id: pId,
              startDate: new Date(),
              restartDate: new Date(),
              watcher: _this.watcher(startModule.name, startModule.watch || null),
              forever: startModule.fork ?
                new (forever.Monitor)('./node_modules/allons-y/fork.js', {
                  fork: true,
                  silent: true,
                  max: startModule.forkMaxRestarts,
                  args: [file, i, startModule.name],
                  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
                }).start() :
                forever.start(startModule.spawnCommands, {
                  max: startModule.spawnMaxRestarts,
                  silent: true,
                  checkFile: false,
                  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
                })
            };

            _processEvents(p, child);

            child.processes.push(p);
          }

          return nextFile();
        }

        _callModule(startModule, nextFile);
      });
    });
  };

  this.stop = function(callback, fromStart) {
    _this.bootstrap({
      owner: 'stop'
    }, function() {
      _this.log('allons-y', 'stop');

      var pids = _pids();

      if (!fromStart) {
        _this.outputBanner();

        _this.outputInfo('► stop\n');
      }

      pids.forEach(function(pid) {
        if (!pid) {
          return;
        }

        if (!fromStart) {
          _this.outputSuccess('  kill "' + pid[1] + '" (#' + pid[0] + ')');
        }

        _this.log('allons-y', 'processes-stop:' + pid[0] + ',' + pid[1]);

        forever.kill(pid[0]);
      });

      _cleanPids();

      if (callback) {
        callback();
      }
    });
  };

  this.fork = function() {
    _isFork = true;

    if (process.argv.length < 4) {
      return;
    }

    DependencyInjection.service('$processIndex', function() {
      return parseInt(process.argv[3], 10);
    });

    DependencyInjection.service('$processName', function() {
      return parseInt(process.argv[4], 10);
    });

    _this.bootstrap({
      owner: 'fork',
      processIndex: process.argv[3],
      processName: process.argv[4]
    }, function() {
      var startModule = require(path.resolve(process.argv[2]));

      _this.log('allons-y', 'fork-exec:' + process.argv[4] + ':' + process.argv[3]);

      _callModule(startModule);
    });
  };

};
