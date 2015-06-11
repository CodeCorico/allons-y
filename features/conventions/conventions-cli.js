'use strict';

var path = require('path'),
    fs = require('fs');

function beforeInstall(config, utils, next) {
  var source = path.resolve(__dirname, 'resources');

  utils.log('► Write conventions files... ');

  if (!fs.existsSync(path.resolve(utils.path, '.jshintrc'))) {
    utils.copy(path.join(source, '.jshintrc'), path.resolve(utils.path, '.jshintrc'));
  }

  if (!fs.existsSync(path.resolve(utils.path, '.jscsrc'))) {
    utils.copy(path.join(source, '.jscsrc'), path.resolve(utils.path, '.jscsrc'));
  }

  if (!fs.existsSync(path.resolve(utils.path, 'CONTRIBUTING.md'))) {
    var contributing = utils.getContent(path.join(source, 'CONTRIBUTING.md')),
        item;

    for (item in config.install) {
      contributing = contributing.replace(new RegExp('{{' + item + '}}', 'g'), config.install[item]);
    }

    utils.putContent(contributing, path.resolve(utils.path, 'CONTRIBUTING.md'));
  }

  utils.log('[OK]\n');

  next();
}

module.exports = {
  beforeInstall: beforeInstall
};
