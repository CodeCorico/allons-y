'use strict';

var clc = require('cli-color');

module.exports = function() {

  var _this = this;

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
      clc.red(margin + '       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄    ') + '\n',
      clc.red(margin + '                                 ') + '\n',
      clc.red(margin + '             ') + clc.redBright('Allons-y') + '\n',
      clc.red(margin + '                                 ') + '\n',
      clc.red(margin + '       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀    ') + '\n\n',
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

  this.colorInfo = clc.cyanBright;

  this.textInfo = function(text) {
    return _this.colorInfo(text);
  };

  this.outputInfo = function(text) {
    process.stdout.write(_this.textInfo(text));
  };

  this.colorWarning = clc.yellowBright;

  this.textWarning = function(text) {
    return _this.colorWarning(text);
  };

  this.outputWarning = function(text) {
    process.stdout.write(_this.textWarning(text));
  };

  this.colorSuccess = clc.greenBright;

  this.textSuccess = function(text) {
    return _this.colorSuccess(text);
  };

  this.outputSuccess = function(text) {
    process.stdout.write(_this.textSuccess(text));
  };

  this.output = function(text) {
    process.stdout.write(clc.white(text));
  };
};
