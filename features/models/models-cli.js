'use strict';

var extend = require('extend'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    glob = require('glob');

function beforeInstall(config, utils, next) {
  utils.log('► Add models dependencies... ');

  config.package = extend(true, {
    dependencies: {
      async: '^0.9.2',
      'events-manager': '^1.0.4',
      mongoose: '^4.0.1'
    }
  }, config.package);

  utils.log('[OK]\n');

  next();
}

function afterInstall(config, utils, next) {
  var source = path.resolve(__dirname, 'resources'),
      featuresDest = path.resolve(utils.path, 'features');

  utils.log('► Create common models files... ');

  mkdirp.sync(path.join(featuresDest, 'common/models'));
  mkdirp.sync(path.join(featuresDest, 'favicon/models'));
  mkdirp.sync(path.join(featuresDest, 'shortcuts/models'));

  utils.copy(path.join(source, 'common-models-gulpfile.js'), path.join(featuresDest, 'common/common-models-gulpfile.js'));
  utils.copy(path.join(source, 'favicon-service.js'), path.join(featuresDest, 'favicon/models/favicon-service.js'));
  utils.copy(path.join(source, 'shortcuts-service.js'), path.join(featuresDest, 'shortcuts/models/shortcuts-service.js'));

  glob.sync(path.join(source, 'common-*-@(factory|model|service).js')).forEach(function(file) {
    var filename = file.split('/').pop();
    utils.copy(file, path.join(featuresDest, 'common/models', filename));
  });

  utils.log('[OK]\n');

  next();
}

module.exports = {
  beforeInstall: beforeInstall,
  afterInstall: afterInstall,
  env: [{
    type: 'input',
    name: 'DATABASE_HOST',
    message: 'MongoDB host (with port) connection:'
  }, {
    type: 'input',
    name: 'DATABASE_USER',
    message: 'MongoDB user:'
  }, {
    type: 'input',
    name: 'DATABASE_PASSWORD',
    message: 'MongoDB password:'
  }, {
    type: 'input',
    name: 'DATABASE_NAME',
    message: 'MongoDB database name:'
  }]
};
