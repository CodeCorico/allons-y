'use strict';

var path = require('path'),
    fs = require('fs'),
    extend = require('extend');

function beforeInstall(config, utils, next) {
  utils.log('► Write configurations file... ');

  config.package = extend(true, {
    name: config.install.name,
    version: '0.0.0',
    description: config.install.description,
    author: config.install.author,
    dependencies: {
      'forever-monitor': '^1.5.2'
    },
    main: 'gulpfile.js',
    private: config.install.private,
    scripts: {
      prestart: 'npm install',
      start: 'node start'
    }
  }, config.package);

  var source = path.resolve(__dirname, 'resources');

  utils.copy(path.join(source, '.gitignore'), path.resolve(utils.path, '.gitignore'));
  utils.copy(path.join(source, 'start.js'), path.resolve(utils.path, 'start.js'));

  if (!fs.existsSync(path.resolve(utils.path, 'README.md'))) {
    var readme = utils.getContent(path.join(source, 'README.md')),
        item;

    for (item in config.install) {
      readme = readme.replace(new RegExp('{{' + item + '}}', 'g'), config.install[item]);
    }

    utils.putContent(readme, path.resolve(utils.path, 'README.md'));
  }

  utils.log('[OK]\n');

  next();
}

module.exports = {
  install: [{
    type: 'input',
    name: 'title',
    message: 'Real app name:',
    validate: function(value) {
      return !value ? 'Please give a name.' : true;
    }
  }, {
    type: 'input',
    name: 'name',
    message: 'App code name (lower alphanumerics):',
    validate: function(value) {
      if (value && value.match(/^[a-z]+[a-z0-9-]*$/)) {
        return true;
      }

      return 'Please give a good formated name.';
    }
  }, {
    type: 'input',
    name: 'description',
    message: 'Description:'
  }, {
    type: 'input',
    name: 'author',
    message: 'Author:'
  }, {
    type: 'confirm',
    name: 'private',
    message: 'Is it a private project?',
    default: false
  }],
  beforeInstall: beforeInstall
};
