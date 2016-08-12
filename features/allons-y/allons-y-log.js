'use strict';

var clc = require('cli-color');

module.exports = function() {

  this.logBanner = function(text) {
    if (Array.isArray(text)) {
      text = text.join('');
    }

    text = text ? '  ' + clc.blueBright(text) : '';

    if (clc.width) {
      var bannerWidth = 38,
          fillCharasNb = Math.floor((clc.width - bannerWidth) / 2),
          margin = fillCharasNb > 0 ? new Array(Math.floor((clc.width - bannerWidth) / 2)).join(' ') : '';

      var banner = [
        '\n',
        clc.red(margin + '       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄    ') + '\n',
        clc.red(margin + '                                 ') + '\n',
        clc.red(margin + '             ') + clc.redBright('Allons-y!') + '\n',
        clc.red(margin + '                                 ') + '\n',
        clc.red(margin + '       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀    ') + '\n\n\n',
        text
      ];

      console.log([clc.reset].concat(banner).join(''));
    }
  };

  this.logTitle = function(text) {
    console.log('\n');
    console.log(clc.blue(new Array(clc.width).join('▀')));
    console.log(clc.blueBright('    ' + text));
    console.log(clc.blue(new Array(clc.width).join('▄')));
  };

  this.logInfo = function(text) {
    process.stdout.write(clc.blueBright(text));
  };

  this.logWarning = function(text) {
    process.stdout.write(clc.yellowBright('/!\\ ' + text));
  };

  this.logSuccess = function(text) {
    process.stdout.write(clc.greenBright(text));
  };

  this.log = function(text) {
    process.stdout.write(clc.white(text));
  };
};
