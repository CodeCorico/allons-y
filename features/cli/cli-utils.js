'use strict';

var clc = require('cli-color'),
    path = require('path'),
    fs = require('fs-extra');

var utils = {
  path: process.cwd(),

  package: require(path.resolve(__dirname, '..', '..', 'package.json')),

  banner: function(text) {
    if (text && typeof text == 'object' && text.length) {
      text = text.join('');
    }

    text = text ? clc.blueBright(text) : '';

    if (clc.width) {
      var bannerWidth = 38,
          fillCharasNb = Math.floor((clc.width - bannerWidth) / 2),
          margin = fillCharasNb > 0 ? new Array(Math.floor((clc.width - bannerWidth) / 2)).join(' ') : '';

      var banner = [
        '\n',
        clc.red(margin + '    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░') + '\n',
        clc.red(margin + '   ░░                            ░░') + '\n',
        clc.red(margin + '   ░                              ░') + '\n',
        clc.red(margin + '   ░    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄    ░') + '\n',
        clc.red(margin + '   ░                              ░') + '\n',
        clc.red(margin + '   ░           ') + clc.redBright('Allons-y!') + clc.red('          ░') + '\n',
        clc.red(margin + '   ░                              ░') + '\n',
        clc.red(margin + '   ░    ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀    ░') + '\n',
        clc.red(margin + '   ░                              ░') + '\n',
        clc.red(margin + '   ░░                            ░░') + '\n',
        clc.red(margin + '    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░') + '\n\n',
        clc.red(margin + '« Webapps that come from a S.F. movie »') + '\n\n\n',
        text
      ];

      console.log([clc.reset].concat(banner).join(''));
    }
  },

  title: function(text) {
    console.log('\n');
    console.log(clc.blue(new Array(clc.width).join('▀')));
    console.log(clc.blueBright('    ' + text));
    console.log(clc.blue(new Array(clc.width).join('▄')));
  },

  info: function(text) {
    process.stdout.write(clc.blueBright(text));
  },

  warning: function(text) {
    process.stdout.write(clc.yellowBright('/!\\ ' + text));
  },

  success: function(text) {
    process.stdout.write(clc.greenBright(text));
  },

  log: function(text) {
    process.stdout.write(clc.white(text));
  },

  getContent: function(source) {
    return fs.readFileSync(source, 'utf-8');
  },

  putContent: function(text, destination) {
    fs.writeFileSync(destination, text);
  },

  copy: function(source, destination) {
    fs.copySync(source, destination);
  }
};

module.exports = utils;
