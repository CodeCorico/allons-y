'use strict';

GLOBAL.DependencyInjection = require('mvw-injection').MVC();

module.exports = new (function() {

  var path = require('path'),
      _this = this;

  DependencyInjection.service('$allonsy', [function() {
    return _this;
  }]);

  require(path.resolve(__dirname, 'allons-y-log.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-watch.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-glob.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-live-commands.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-commands.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-bootstrap.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-processes.js')).apply(this);

})();
