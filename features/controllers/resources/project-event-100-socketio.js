'use strict';

var path = require('path'),
    glob = require('glob'),
    socketioFiles = glob.sync(path.resolve(__dirname, '../**/controllers/*-event.js'));

module.exports = ['$io', function($io) {
  var allConfigs = [];

  socketioFiles.forEach(function(file) {
    var configs = require(file);

    if (Object.prototype.toString.call(configs) != '[object Array]') {
      configs = [configs];
    }

    allConfigs = allConfigs.concat(configs);
  });

  $io.on('connection', function(socket) {

    allConfigs.forEach(function(config) {

      socket.on(config.event, function(message) {
        DependencyInjection.injector.controller.invoke(null, config.controller, {
          controller: {
            $event: function() {
              return config.event;
            },

            $socket: function() {
              return socket;
            },

            $message: function() {
              return message;
            },

            $done: function() {
              return function() {
              };
            }
          }
        });
      });
    });
  });
}];
