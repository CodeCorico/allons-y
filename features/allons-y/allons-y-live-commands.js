'use strict';

module.exports = function() {

  var clc = require('cli-color'),
      readline = require('readline'),
      util = require('util'),
      _this = this,
      _commands = {},
      _prefix = 'allons-y> ';

  this.liveCommand = function(commands, description, action) {
    if (!Array.isArray(commands)) {
      commands = [commands];
    }

    commands.forEach(function(command) {
      command = command.split(' ')[0];

      _commands[command] = {
        commands: commands.join(', '),
        description: description,
        action: action
      };
    });
  };

  this.liveCommand(['help', 'h'], 'output usage information', function() {
    _this.outputInfo('\n► help:\n');

    var commandsInUse = [],
        commandsLines = [],
        maxWidth = 0;

    Object.keys(_commands).forEach(function(key) {
      var command = _commands[key];

      if (commandsInUse.indexOf(command.commands) > -1) {
        return;
      }
      commandsInUse.push(command.commands);

      maxWidth = command.commands.length > maxWidth ? command.commands.length : maxWidth;

      commandsLines.push([command.commands, command.description]);
    });

    for (var i = 0; i < commandsLines.length; i++) {
      var spaces = '';

      for (var j = 0; j < (maxWidth - commandsLines[i][0].length) + 2; j++) {
        spaces += ' ';
      }

      commandsLines[i] = '  ' + commandsLines[i][0] + spaces + commandsLines[i][1];
    }

    _this.output([
      '  Usage: [command] [options...]',
      '',
      '  Commands:',
      ''
    ].concat(commandsLines).join('\n') + '\n');
  });

  this.calliveCommand = function(command) {
    command = command || 'help';

    var args = command.split(' ');
    command = args.splice(0, 1);

    if (!_commands[command]) {
      _this.outputWarning('\n  Command "' + command + '" not found.');

      command = 'help';
    }

    _this.log('allons-y', 'live-commands-call:' + command);

    DependencyInjection.injector.controller.invoke(null, _commands[command].action, {
      controller: {
        $args: function() {
          return args;
        }
      }
    });
  };

  function _prompt(rl) {
    if (process.stdout.write('')) {
      rl.setPrompt(clc.blackBright(_prefix), _prefix.length);
      rl.prompt();
    }
    else {
      process.stdout.on('drain', function() {
        rl.setPrompt(clc.blackBright(_prefix), _prefix.length);
        rl.prompt();
      });
    }
  }

  this.startLiveCommand = function() {
    if (process.env.ALLONSY_LIVE_COMMANDS && process.env.ALLONSY_LIVE_COMMANDS == 'false') {
      return;
    }

    _this.log('allons-y', 'live-commands-start');

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var _output = _this.output,
        _workingsObj = {},
        _workings = [];

    _output('\n');

    _this.output = function() {
      _output('\x1b[2K');

      for (var i = 0; i < _workings.length + 1 + (_workings.length ? 3 : 0); i++) {
        _output('\x1b[1A\x1b[2K');
      }
      _output('\r');

      var text = util.format.apply(process, arguments);

      text = text
        .split('\n')
        .filter(function(line) {
          if (line.indexOf('[working:') > -1) {
            var id = line.match(/\[working:(.*?)\]/)[1];

            _workingsObj[id] = line.replace('[working:' + id + ']', '');
            _workings = Object.keys(_workingsObj).map(function(key) {
              return _workingsObj[key] + '\n';
            });

            return false;
          }
          else if (line.indexOf('[done:') > -1) {
            var id = line.match(/\[done:(.*?)\]/)[1];

            delete _workingsObj[id];
            _workings = Object.keys(_workingsObj).map(function(key) {
              return _workingsObj[key];
            });

            _output(line.replace('[done:' + id + ']', '') + '\n');

            return false;
          }

          return true;
        })
        .join('\n');

      _output(text);

      if (_workings.length) {
        _output('\n' + _this.textInfo('▄▄▄▄ Working') + '\n\n');

        _workings.forEach(function(line) {
          _output(line);
        });
      }

      _output('\n');

      rl._refreshLine();
    };

    rl.on('line', function(line) {
      line = line.trim();

      if (!line) {
        return rl._refreshLine();
      }

      _this.calliveCommand(line);
    });

    _prompt(rl);
  };

};
