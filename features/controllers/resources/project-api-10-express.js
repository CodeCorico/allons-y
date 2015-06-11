'use strict';

var path = require('path'),
    glob = require('glob'),
    apiFiles = glob.sync(path.resolve(__dirname, '../**/controllers/*-api.js'));

module.exports = ['$server', function($server) {

  apiFiles.forEach(function(file) {
    var configs = require(file);

    if (Object.prototype.toString.call(configs) != '[object Array]') {
      configs = [configs];
    }

    configs.forEach(function(config) {
      config.method = (config.method || 'get').toLowerCase();
      $server[config.method]('/api/' + config.url, function(req, res, next) {

        DependencyInjection.injector.controller.invoke(null, config.controller, {
          controller: {
            $req: function() {
              return req;
            },

            $res: function() {
              return res;
            },

            $next: function() {
              return next;
            },

            $done: function() {
              return function() {};
            }
          }
        });
      });
    });
  });

  $server.all('/api/*', function(req, res) {

    res
      .status(404)
      .json({
        error: 'Not found'
      });
  });
}];
