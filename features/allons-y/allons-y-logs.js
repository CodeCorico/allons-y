'use strict';

module.exports = function() {

  var clc = require('cli-color'),
      util = require('util'),
      _this = this,
      _stdoutWrite = process.stdout.write;

  this.LOG_TYPE = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
  };

  function _logDate(date) {
    if (!date) {
      return '';
    }

    var hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
  }

  this.output = function() {
    _stdoutWrite.apply(process.stdout, [util.format.apply(process, arguments)]);
  };

  this.log = function(namespace, log, args, type) {
    log = {
      namespace: namespace,
      log: log,
      type: type || _this.LOG_TYPE.INFO,
      args: args || null,
      date: new Date()
    };

    if (
      process.env.ALLONSY_LOGS_OUTPUT &&
      (process.env.ALLONSY_LOGS_OUTPUT == 'all' ||
        (process.env.ALLONSY_LOGS_OUTPUT == 'err' && log.type == this.LOG_TYPE.ERROR) ||
        (process.env.ALLONSY_LOGS_OUTPUT == 'warn' && (log.type == this.LOG_TYPE.ERROR || log.type == this.LOG_TYPE.WARNING))
      )
    ) {
      _this[
        log.type == this.LOG_TYPE.WARNING ? 'outputWarning' : (
          log.type == this.LOG_TYPE.ERROR ? 'outputError' : 'outputInfo'
        )
      ]('[' + _logDate(log.date) + '] [' + log.type.toUpperCase() + '] [' + log.namespace + '] ' + log.log);

      if (log.args && log.args.error) {
        _this.output(log.args.error, '\n');
      }
    }

    _this.fire('log', log);
  };

  this.logWarning = function(namespace, log, args) {
    _this.log(namespace, log, args, _this.LOG_TYPE.WARNING);
  },

  this.logError = function(namespace, log, args) {
    _this.log(namespace, log, args, _this.LOG_TYPE.ERROR);
  };

  this.outputBanner = function(text) {
    if (Array.isArray(text)) {
      text = text.join('');
    }

    text = text ? '  ' + clc.cyanBright(text) : '';

    var margin = '';

    if (clc.windowSize.width) {
      var bannerWidth = 38,
          fillCharasNb = Math.floor((clc.windowSize.width - bannerWidth) / 2);

      margin = fillCharasNb > 0 ? new Array(Math.floor((clc.windowSize.width - bannerWidth) / 2)).join(' ') : '';
    }

    _this.output([
      '\n',
      clc.red(margin + '       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n\n'),
      clc.red(margin + '             ') + clc.redBright('Allons-y') + '\n\n',
      clc.red(margin + '       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n\n'),
      text
    ].join(''));
  };

  this.textBar = function(color) {
    var bar = new Array(clc.windowSize.width).join('▀');

    return color ? color(bar) : bar;
  };

  this.outputBar = function(color) {
    _this.output(_this.textBar(color));
  };

  this.logTitle = function(text) {
    _this.output('\n\n');
    _this.outputBar(_this.colorInfo);
    _this.output(_this.colorInfo('    ' + text));
    _this.outputBar(_this.colorInfo);
  };

  this.colorInfo = clc.cyanBright;

  this.textInfo = function(text) {
    return _this.colorInfo(text);
  };

  this.outputInfo = function(text, breakline) {
    _this.output(_this.textInfo(text) + (typeof breakline == 'undefined' || breakline ? '\n' : ''));
  };

  this.colorSuccess = clc.greenBright;

  this.textSuccess = function(text) {
    return _this.colorSuccess(text);
  };

  this.outputSuccess = function(text, breakline) {
    _this.output(_this.textSuccess(text) + (typeof breakline == 'undefined' || breakline ? '\n' : ''));
  };

  this.colorWarning = clc.yellowBright;

  this.textWarning = function(text) {
    return _this.colorWarning(text);
  };

  this.outputWarning = function(text, breakline) {
    _this.output(_this.textWarning(text) + (typeof breakline == 'undefined' || breakline ? '\n' : ''));
  };

  this.colorError = clc.redBright;

  this.textError = function(text) {
    return _this.colorError(text);
  };

  this.outputError = function(text, breakline) {
    _this.output(_this.textError(text) + (typeof breakline == 'undefined' || breakline ? '\n' : ''));
  };
};
