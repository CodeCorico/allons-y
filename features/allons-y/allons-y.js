'use strict';

global.DependencyInjection = require('mvw-injection').MVC();

module.exports = new (function() {

  var path = require('path'),
      EventsManager = require('events-manager').EventsManager,
      _this = this;

  EventsManager.call(this);

  DependencyInjection.service('$allonsy', function() {
    return _this;
  });

  require(path.resolve(__dirname, 'allons-y-logs.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-watch.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-glob.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-live-commands.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-commands.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-bootstrap.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-processes.js')).apply(this);
})();
