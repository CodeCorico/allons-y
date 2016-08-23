'use strict';

var clc = require('cli-color');

module.exports = function() {

  var _this = this;

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

  this.log = function(namespace, log, args, type) {
    log = {
      namespace: namespace,
      log: log,
      type: type || _this.LOG_TYPE.INFO,
      args: args || null,
      date: new Date()
    };

    if (process.env.ALLONSY_LOGS_OUTPUT && process.env.ALLONSY_LOGS_OUTPUT == 'true') {
      console.log('[' + _logDate(log.date) + '] [' + log.type.toUpperCase() + '] [' + log.namespace + '] ' + log.log);

      if (log.args && log.args.error) {
        console.log(log.args.error);
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

    console.log([
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
    console.log(_this.textBar(color));
  };

  this.logTitle = function(text) {
    console.log('\n');
    _this.outputBar(_this.colorInfo);
    console.log(_this.colorInfo('    ' + text));
    _this.outputBar(_this.colorInfo);
  };

  this.output = function(text) {
    process.stdout.write(text);
  };

  this.colorInfo = clc.cyanBright;

  this.textInfo = function(text) {
    return _this.colorInfo(text);
  };

  this.outputInfo = function(text) {
    process.stdout.write(_this.textInfo(text));
  };

  this.colorSuccess = clc.greenBright;

  this.textSuccess = function(text) {
    return _this.colorSuccess(text);
  };

  this.outputSuccess = function(text) {
    process.stdout.write(_this.textSuccess(text));
  };

  this.colorWarning = clc.yellowBright;

  this.textWarning = function(text) {
    return _this.colorWarning(text);
  };

  this.outputWarning = function(text) {
    process.stdout.write(_this.textWarning(text));
  };

  this.colorError = clc.redBright;

  this.textError = function(text) {
    return _this.colorError(text);
  };

  this.outputError = function(text) {
    process.stdout.write(_this.textError(text));
  };
};
