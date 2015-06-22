module.exports = function() {
  'use strict';

  DependencyInjection.service('$SQLService', [function() {

    var Sequelize = require('sequelize');

    return new (function SQLService() {

      var _connections = [];

      this.TYPES = {
        MYSQL: 'mysql',
        MARIADB: 'mariadb',
        SQLITE: 'sqlite',
        POSTGRES: 'postgres',
        MSSQL: 'mssql'
      };

      this.connections = function() {
        return _connections;
      };

      this.create = function(type, host, database, user, password, poolSize, storage) {
        poolSize = poolSize || 5;

        var options = {
          logging: false,
          host: host,
          dialect: type,
          pool: {
            max: poolSize,
            min: 0,
            idle: 10000
          }
        };

        if (storage) {
          options.storage = storage;
        }

        var sequelize = new Sequelize(database, user, password, options);

        _connections.push(sequelize);

        return sequelize;
      };

    })();

  }]);

};
