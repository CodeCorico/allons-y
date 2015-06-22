module.exports = function() {
  'use strict';

  var isNode = typeof module != 'undefined' && typeof module.exports != 'undefined',
      events = isNode ? require('events-manager').EventsManager : window.EventsManager;

  DependencyInjection.model('$AbstractModel', [function() {
    return function AbstractModel(modelName, nodeConstructor, browserConstructor) {

      var model;

      if (isNode && nodeConstructor) {
        DependencyInjection.injector.model.invoke(null, nodeConstructor, {
          model: {
            $returnMongoModel: function() {
              return function(databaseInstance, schema) {
                model = databaseInstance.model(modelName, schema);
              };
            },

            $returnSQLModel: function() {
              return function(databaseInstance, schema, options) {
                model = databaseInstance.define(modelName, schema, options);
              };
            },

            $returnModel: function() {
              return function(returnModel) {
                model = returnModel;
              };
            }
          }
        });
      }
      else if (!isNode && browserConstructor) {
        model = function(config) {

          var _this = this;

          events.call(this);

          DependencyInjection.injector.model.invoke(null, browserConstructor, {
            model: {
              $this: function() {
                return _this;
              },

              $config: function() {
                return config;
              }
            }
          });
        };
      }

      return model;
    };
  }]);

};
