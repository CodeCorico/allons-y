module.exports = function() {
  'use strict';

  DependencyInjection.service('$MongoService', [function() {

    var mongoose = require('mongoose');

    return new (function MongoService() {

      var _connections = [];

      this.connections = function() {
        return _connections;
      };

      this.create = function(host, database, user, password, poolSize) {
        // MongDB max connections: 20 - Mongoose monitor 1 = 19
        poolSize = poolSize || 19;

        mongoose.connect(
          'mongodb://' + (user ? user + ':' + password + '@' : '') + host + '/' + database, {
            server: {
              socketOptions: {
                keepAlive: 1
              },
              poolSize: poolSize
            }
          }
        );

        _connections.push(mongoose);

        return mongoose;
      };

    })();

  }]);

};
