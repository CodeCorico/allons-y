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
      'events-manager': '^1.0.4'
    }
  }, config.package);

  if (config.install.mongodb) {
    config.package = extend(true, {
      dependencies: {
        mongoose: '^4.0.6'
      }
    }, config.package);
  }

  if (config.install.sql) {
    config.package = extend(true, {
      dependencies: {
        sequelize: '^3.3.0'
      }
    }, config.package);
  }

  if (config.install.mysql) {
    config.package = extend(true, {
      dependencies: {
        mysql: '^2.7.0'
      }
    }, config.package);
  }

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
  install: [{
    type: 'confirm',
    name: 'mongodb',
    message: 'Use MongoDB connector (Mongoose)?',
    default: true
  }, {
    type: 'confirm',
    name: 'sql',
    message: 'Use SQL connector (Sequelize)?',
    default: true
  }, {
    type: 'confirm',
    name: 'mysql',
    message: 'Use MySQL (with Sequelize)?',
    default: true,
    when: function(answers) {
      return answers.sql;
    }
  }],
  beforeInstall: beforeInstall,
  afterInstall: afterInstall,
  env: [{
    type: 'input',
    name: 'MONGO_COUNT',
    message: 'How many MongoDB databases you want to use?'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_NAME',
    message: 'Name your MongoDB instance {{index1}} (capitalized):'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_HOST',
    message: 'MongoDB instance {{index1}} host (with port):'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_USER',
    message: 'MongoDB instance {{index1}} user:'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_PASSWORD',
    message: 'MongoDB instance {{index1}} password:'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_DB',
    message: 'MongoDB instance {{index1}} database name:'
  }, {
    loop: 'MONGO_COUNT',
    type: 'input',
    name: 'MONGO_POOL_SIZE',
    message: 'MongoDB instance {{index1}} pool size:',
    default: 19
  }, {
    type: 'input',
    name: 'SQL_COUNT',
    message: 'How many SQL databases you want to use?'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_NAME',
    message: 'Name your SQL instance {{index1}} (capitalized):'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_TYPE',
    message: 'Type of your instance {{index1}} (mysql|mariadb|sqlite|postgres|mssql):'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_HOST',
    message: 'SQL instance {{index1}} host (with port):'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_USER',
    message: 'SQL instance {{index1}} user:'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_PASSWORD',
    message: 'SQL instance {{index1}} password:'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_DB',
    message: 'SQL instance {{index1}} database name:'
  }, {
    loop: 'SQL_COUNT',
    type: 'input',
    name: 'SQL_POOL_SIZE',
    message: 'SQL instance {{index1}} pool size:',
    default: 5
  }]
};
