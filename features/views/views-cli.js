'use strict';

var extend = require('extend'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

function beforeInstall(config, utils, next) {
  utils.log('► Add views dependencies... ');

  config.package = extend(true, {
    dependencies: {
      gulp: '^3.9.0',
      'gulp-rename': '^1.2.2',
      'gulp-sourcemaps': '^1.5.2',
      'gulp-uglify': '^1.1.0',
      glob: '^5.0.10',
      page: '^1.6.3'
    }
  }, config.package);

  if (config.install.plumes) {
    config.package = extend(true, {
      dependencies: {
        jquery: '^2.1.3',
        ractive: '^0.7.1',
        'ractive-require': '^0.2.2',
        plumes: config.install['plumes-unstable'] ? 'git+ssh://git@github.com/CodeCorico/plumes.git' : '^0.1.0'
      }
    }, config.package);
  }

  utils.log('[OK]\n');

  next();
}

function afterInstall(config, utils, next) {
  var source = path.resolve(__dirname, 'resources'),
      featuresDest = path.resolve(utils.path, 'features');

  utils.log('► Create common views folders... ');

  mkdirp.sync(path.join(featuresDest, 'common/views/less'));
  mkdirp.sync(path.join(featuresDest, 'common/views/css'));
  mkdirp.sync(path.join(featuresDest, 'common/views/html'));

  mkdirp.sync(path.join(featuresDest, config.install.name, 'views/html'));
  mkdirp.sync(path.join(featuresDest, config.install.name, 'views/resources'));
  mkdirp.sync(path.join(featuresDest, config.install.name, 'views/css'));
  mkdirp.sync(path.join(featuresDest, config.install.name, 'controllers'));

  utils.log('[OK]\n');

  if (config.install.plumes) {
    utils.log('► Create common less mixins... ');

    utils.copy(path.resolve(utils.path, 'node_modules/plumes/features/common/less/common-mixins.less'), path.join(featuresDest, 'common/views/less/common-mixins.less'));
    utils.copy(path.resolve(utils.path, 'node_modules/plumes/features/common/less/common-variables.less'), path.join(featuresDest, 'common/views/less/common-variables.less'));

    utils.log('[OK]\n');
  }

  utils.log('► Create "' + config.install.name + '" view files... ');

  var featurePath = path.join(featuresDest, config.install.name),
      viewsDir = featurePath + '/views/',
      viewsPath = viewsDir + '/' + config.install.name + '-',
      htmlPath = viewsDir + 'html/' + config.install.name + '-',
      cssPath = viewsDir + 'css/' + config.install.name + '-',
      controllerPath = featurePath + '/controllers/' + config.install.name + '-',
      copyFiles = [{
        source: path.join(source, 'project-index.html'),
        destination: htmlPath + 'index.html'
      }, {
        source: path.join(source, 'project-start-mask.less'),
        destination: cssPath + 'start-mask.less'
      }, {
        source: path.join(source, 'project-index.js'),
        destination: viewsPath + 'index.js'
      }, {
        source: path.join(source, 'project-404-route.js'),
        destination: controllerPath + '404-route.js'
      }];

  copyFiles.forEach(function(file) {
    if (!fs.existsSync(file.destination)) {
      var content = utils.getContent(file.source);

      for (var item in config.install) {
        content = content.replace(new RegExp('{{' + item + '}}', 'g'), config.install[item]);
      }

      utils.putContent(content, file.destination);
    }
  });

  var fileDest = path.join(featuresDest, config.install.name, '/views/resources/favicon.ico');

  if (!fs.existsSync(fileDest)) {
    utils.copy(path.join(source, 'favicon.ico'), fileDest);
  }

  fileDest = path.join(featuresDest, config.install.name, '/views/resources/favicon.png');

  if (!fs.existsSync(fileDest)) {
    utils.copy(path.join(source, 'favicon.png'), fileDest);
  }

  utils.log('[OK]\n');

  utils.log('► Create gulpfile... ');

  utils.copy(path.join(source, 'gulpfile.js'), path.resolve(utils.path, 'gulpfile.js'));
  utils.copy(path.join(source, 'common-resources-gulpfile.js'), path.join(featuresDest, 'common/common-resources-gulpfile.js'));
  utils.copy(path.join(source, 'common-routes-gulpfile.js'), path.join(featuresDest, 'common/common-routes-gulpfile.js'));
  utils.copy(path.join(source, 'common-routes-template.js'), path.join(featuresDest, 'common/common-routes-template.js'));
  utils.copy(path.join(source, 'common-route-template.js'), path.join(featuresDest, 'common/common-route-template.js'));
  utils.copy(path.join(source, 'common-bootstrap.js'), path.join(featuresDest, 'common/views/common-bootstrap.js'));

  if (config.install.plumes) {
    utils.copy(path.join(source, 'common-plumes-gulpfile.js'), path.join(featuresDest, 'common/common-plumes-gulpfile.js'));
  }

  utils.log('[OK]\n');

  next();
}

module.exports = {
  install: [{
    type: 'confirm',
    name: 'plumes',
    message: 'Use jQuery + Ractive.js + Plumes?',
    default: true
  }, {
    type: 'confirm',
    name: 'plumes-unstable',
    message: 'Use Plumes #master version (unstable)?',
    default: false,
    when: function(answers) {
      return answers.plumes;
    }
  }],
  beforeInstall: beforeInstall,
  afterInstall: afterInstall,
  env: [{
    type: 'confirm',
    name: 'MINIFIED',
    message: 'Use minified asset files (js, css, ...)?',
    default: false
  }, {
    type: 'confirm',
    name: 'WATCHER',
    message: 'Watch files modifications (dev)?',
    default: true
  }]
};
