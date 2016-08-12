'use strict';

GLOBAL.DependencyInjection = require('mvw-injection').MVC();

var path = require('path'),
    async = require('async');

module.exports = new (function() {

  require(path.resolve(__dirname, 'allons-y-log.js')).apply(this);
  require(path.resolve(__dirname, 'allons-y-glob.js')).apply(this);

  var _this = this;

  function _bootstrap(options, callback) {
    var files = _this.filesSyncSortered('*allons-y-bootstrap.js');

    async.mapSeries(files, function(file, nextFile) {

      var bootstrapModule = require(path.resolve(file));

      bootstrapModule.bootstrap(options, nextFile);

    }, function() {
      callback();
    });
  }

  this.start = function() {
    console.log('BEFORE START');

    _bootstrap({
      owner: 'start'
    }, function() {

      console.log('START');

      var files = _this.filesSyncSortered('*allons-y-start.js');

      files.forEach(function(file) {
        var startModule = require(path.resolve(file));


        DependencyInjection.injector.controller.invoke(null, startModule.module);
      });
    });
  };

  this.stop = function() {
    console.log('BEFORE STOP');

    _bootstrap({
      owner: 'stop'
    }, function() {

      console.log('STOP');
    });
  };

})();
