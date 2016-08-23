'use strict';

module.exports = function() {

var clc = require('cli-color');

  var readline = require('readline'),
      _this = this,
      _commands = {};

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
    _this.outputInfo('\n► help:\n\n');

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

    console.log([
      '',
      '  Usage: [command] [options...]',
      '',
      '  Commands:',
      ''
    ].concat(commandsLines).join('\n') + '\n');
  });

  this.calliveCommand = function(command) {
    var args = command.split(' ');
    command = args.splice(0, 1);

    if (!_commands[command]) {
      _this.logWarning('allons-y', 'live-commands-unregistered:' + command);

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
    var prefix = 'allons-y> ';

    if (process.stdout.write('')) {
      rl.setPrompt(clc.blackBright(prefix), prefix.length);
      rl.prompt();
    }
    else {
      process.stdout.on('drain', function() {
        rl.setPrompt(clc.blackBright(prefix), prefix.length);
        rl.prompt();
      });
    }
  }

  this.waitLiveCommand = function() {
    if (process.env.ALLONSY_LIVE_COMMANDS && process.env.ALLONSY_LIVE_COMMANDS == 'false') {
      return;
    }

    _this.log('allons-y', 'live-commands-start');

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.on('line', function(line) {
      line = line.trim();

      if (!line) {
        return;
      }

      _this.calliveCommand(line);

      _prompt(rl);
    });

    _prompt(rl);
  };

};
