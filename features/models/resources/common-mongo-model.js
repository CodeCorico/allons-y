module.exports = function() {
  'use strict';

  DependencyInjection.service('$MongoService', [function() {
    var mongoose = require('mongoose');

    mongoose.connect(
      'mongodb://' +
      (process.env.DATABASE_USER ? process.env.DATABASE_USER + ':' + process.env.DATABASE_PASSWORD + '@' : '') +
      process.env.DATABASE_HOST +
      '/' + process.env.DATABASE_NAME, {
        server: {
          socketOptions: {
            keepAlive: 1
          },

          // MongDB max connections: 20 - Mongoose monitor 1 = 19
          poolSize: 19
        }
      }
    );

    return mongoose;
  }]);

};
