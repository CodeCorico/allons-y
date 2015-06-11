module.exports = function() {
  'use strict';

  DependencyInjection.service('$DatabaseService', [function() {
    var mongoose = require('mongoose');

    mongoose.connect(
      'mongodb://' +
      (process.env.DATABASE_USER ? process.env.DATABASE_USER + ':' + process.env.DATABASE_PASSWORD + '@' : '') +
      process.env.DATABASE_HOST +
      '/' + process.env.DATABASE_NAME, {
        server: {
          socketOptions: {
            keepAlive: 1
          }
        }
      }
    );

    return mongoose;
  }]);

};
