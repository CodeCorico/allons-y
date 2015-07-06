'use strict';

var extend = require('extend'),
    mkdirp = require('mkdirp'),
    path = require('path');

function beforeInstall(config, utils, next) {
  utils.log('► Add "evolve" npm command... ');

  config.package = extend(true, {
    dependencies: {
      evolv: '^0.1.2'
    },
    scripts: {
      evolve: 'node evolve'
    }
  }, config.package);

  utils.log('[OK]\n');

  next();
}

function afterInstall(config, utils, next) {
  var source = path.resolve(__dirname, 'resources'),
      dest = utils.path + '/';

  utils.log('► Create evolve files... ');

  mkdirp.sync(dest + 'versions/0.1');

  utils.copy(path.join(source, 'evolve-version-0.1.0.js'), path.resolve(utils.path, 'versions/0.1/version-0.1.0.js'));
  utils.copy(path.join(source, 'evolve.js'), path.resolve(utils.path, 'evolve.js'));

  utils.log('[OK]\n');

  next();
}

module.exports = {
  beforeInstall: beforeInstall,
  afterInstall: afterInstall
};
