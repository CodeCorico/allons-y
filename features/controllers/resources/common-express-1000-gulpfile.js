'use strict';

var express = require('express'),
    path = require('path'),
    glob = require('glob'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    packageJson = require(path.resolve(__dirname, '../../package.json')),
    socketIoCookieParser = require('socket.io-cookie-parser'),
    DependencyInjection = require('mvw-injection').MVC();

GLOBAL.DependencyInjection = DependencyInjection;

function _sortByFilePriority(a, b) {
  var priorities = [999, 999],
      files = [a.split('-'), b.split('-')],
      priority = null;

  for (var i = 0; i < files.length; i++) {
    files[i].pop();
    priority = parseFloat(files[i].pop());
    if (!isNaN(priority)) {
      priorities[i] = priority;
    }
  }

  if (priorities[0] < priorities[1]) {
    return -1;
  }

  if (priorities[0] > priorities[1]) {
    return 1;
  }

  return 0;
}

module.exports = function expressTask(gulp, tasksBefore) {
  var expressFiles = glob.sync(path.resolve(__dirname, '../**/*-express.js')),
      socketioFiles = glob.sync(path.resolve(__dirname, '../**/*-socketio.js'));

  gulp.task('express', tasksBefore.concat(['less', 'minify', 'html']), function() {

    require(path.resolve(__dirname, 'models/common-body-data-service'))();
    require(path.resolve(__dirname, 'models/common-i18n-model'))();
    require(path.resolve(__dirname, 'models/common-abstract-model'))();
    require(path.resolve(__dirname, 'models/common-abstract-service'))();
    require(path.resolve(__dirname, 'models/common-database-service'))();
    require(path.resolve(__dirname, 'models/common-sockets-service'))();

    var $DatabaseService = DependencyInjection.injector.controller.get('$DatabaseService');
    $DatabaseService.initModels(function() {

      var server = express();

      DependencyInjection.service('$express', [function() {
        return express;
      }]);

      DependencyInjection.service('$server', [function() {
        return server;
      }]);

      server.use(bodyParser.urlencoded({extended: true}));
      server.use(compression());
      server.use(cookieParser(process.env.COOKIE_SECRET));

      server.set('port', process.env.PORT);

      var http = require('http').Server(server),
          io = require('socket.io')(http);

      io.use(socketIoCookieParser(process.env.COOKIE_SECRET));

      DependencyInjection.service('$http', [function() {
        return http;
      }]);

      DependencyInjection.service('$io', [function() {
        return io;
      }]);

      expressFiles.sort(_sortByFilePriority);

      expressFiles.forEach(function(file) {
        DependencyInjection.injector.controller.invoke(null, require(file));
      });

      socketioFiles.sort(_sortByFilePriority);

      socketioFiles.forEach(function(file) {
        DependencyInjection.injector.controller.invoke(null, require(file));
      });

      http.listen(server.get('port'), function() {
        console.log('► SERVER (' + packageJson.version + ') IS RUNNING ON :' + process.env.PORT);

      });
    });
  });

  return 'express';
};
