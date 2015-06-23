'use strict';

var extend = require('extend'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

function beforeInstall(config, utils, next) {
  utils.log('► Add controllers dependencies... ');

  config.package = extend(true, {
    dependencies: {
      'body-parser': '^1.13.1',
      dotenv: '^1.2.0',
      express: '^4.12.3',
      extend: '^2.0.1',
      compression: '^1.4.3',
      'cookie-parser': '^1.3.5',
      'mvw-injection': '^0.2.3',
      mkdirp: '^0.5.1',
      'socket.io': '^1.3.5',
      'socket.io-cookie-parser': '^1.0.0'
    }
  }, config.package);

  utils.log('[OK]\n');

  next();
}

function afterInstall(config, utils, next) {
  var source = path.resolve(__dirname, 'resources'),
      destFeatures = path.resolve(utils.path, 'features');

  utils.log('► Create common controllers... ');

  mkdirp.sync(path.join(destFeatures, 'common/controllers'));
  utils.copy(path.join(source, 'common-express-1000-gulpfile.js'), path.join(destFeatures, 'common/common-express-1000-gulpfile.js'));
  utils.copy(path.join(source, 'common-mvwinjection-gulpfile.js'), path.join(destFeatures, 'common/common-mvwinjection-gulpfile.js'));
  utils.copy(path.join(source, 'common-page-gulpfile.js'), path.join(destFeatures, 'common/common-page-gulpfile.js'));
  utils.copy(path.join(source, 'common-socketio-gulpfile.js'), path.join(destFeatures, 'common/common-socketio-gulpfile.js'));

  utils.log('[OK]\n');

  utils.log('► Create "' + config.install.name + '" controllers... ');

  mkdirp.sync(path.join(destFeatures, config.install.name));

  ['api-10-express', 'public-10-express', 'index-20-express', 'event-10-socketio', 'errors-1000-express']
    .forEach(function(name) {
      var expressFile = path.join(destFeatures, config.install.name, config.install.name + '-' + name + '.js');
      if (!fs.existsSync(expressFile)) {
        var fileSource = path.join(source, 'project-' + name + '.js'),
            content = utils.getContent(fileSource);

        for (var item in config.install) {
          content = content.replace(new RegExp('{{' + item + '}}', 'g'), config.install[item]);
        }

        utils.putContent(content, expressFile);
      }
    });

  utils.log('[OK]\n');

  next();
}

module.exports = {
  beforeInstall: beforeInstall,
  afterInstall: afterInstall,
  env: [{
    type: 'input',
    name: 'PORT',
    message: 'Express server port:',
    default: '80'
  }, {
    type: 'input',
    name: 'COOKIE_SECRET',
    message: 'Cookie secret passphrase:'
  }]
};
