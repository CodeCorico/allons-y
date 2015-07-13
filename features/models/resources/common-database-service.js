module.exports = function() {
  'use strict';

  DependencyInjection.service('$DatabaseService', [function() {

    var DATABASES_SEARCH = '../../**/*-database.json',
        MODELS_SEARCH = '../../**/models/*-model.js',
        TYPES = {
          postgresql: 'sails-postgresql',
          mysql: 'sails-mysql',
          mongo: 'sails-mongo',
          redis: 'sails-redis'
        },

        path = require('path'),
        glob = require('glob'),
        databaseFiles = path.resolve(__dirname, DATABASES_SEARCH),
        modelsFiles = path.resolve(__dirname, MODELS_SEARCH),
        Waterline = require('waterline');

    return new (function DatabaseService() {

      var _waterline = null,
          _models = [],
          _connections = [],
          _modelsSchemas = {};

      this.models = function() {
        return _models;
      };

      this.connections = function() {
        return _connections;
      };

      this.instance = function() {
        return _waterline;
      };

      this.loadModel = function(name, identity, model) {
        _modelsSchemas[identity] = name;
        _waterline.loadCollection(model);
      };

      this.initModels = function(callback) {

        var waterlineConfig = {
          adapters: {},
          connections: {}
        };

        glob.sync(databaseFiles).forEach(function(file) {
          var configs = require(file);

          if (!configs || !configs.databases || typeof configs.databases != 'object' || !configs.databases.length) {
            return console.log(new Error('Databases configuration missing: ' + file), configs);
          }

          configs.databases.forEach(function(config) {
            if (config.type && TYPES[config.type]) {
              config.adapter = TYPES[config.type];
            }

            if (!config.adapter || !config.name) {
              return console.log(new Error('Impossible to register the database: ' + file), config);
            }

            var prefixEnv = 'DB_' + config.name + '_';

            waterlineConfig.adapters[config.adapter] = require(config.adapter);
            waterlineConfig.connections[config.name] = {
              adapter: config.adapter,
              host: process.env[prefixEnv + 'HOST'] || null,
              port: process.env[prefixEnv + 'PORT'] || null,
              database: process.env[prefixEnv + 'NAME'] || null,
              user: process.env[prefixEnv + 'USER'] || null,
              password: process.env[prefixEnv + 'PASSWORD'] || null,

              // mysql
              charset: process.env[prefixEnv + 'CHARSET'] || null,
              collation: process.env[prefixEnv + 'COLLATION'] || null,

              // optionnal
              pool: process.env[prefixEnv + 'POOL'] && process.env[prefixEnv + 'POOL'] == 'true' ? true : false,
              connectionLimit: process.env[prefixEnv + 'POOL_LIMIT'] || null
            };
          });
        });

        _waterline = new Waterline();

        glob.sync(modelsFiles).forEach(function(file) {
          var modelName = require(file)();
          if (modelName) {
            DependencyInjection.injector.model.get(modelName);
          }
        });

        _waterline.initialize(waterlineConfig, function(err, models) {
          _models = models.collections;
          _connections = models.connections;

          Object.keys(_models).forEach(function(identity) {
            DependencyInjection.model(_modelsSchemas[identity], function() {
              return _models[identity];
            }, true);
          });

          if (callback) {
            callback();
          }
        });
      };

    })();

  }]);

};
