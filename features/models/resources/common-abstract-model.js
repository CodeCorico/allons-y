module.exports = function() {
  'use strict';

  var isNode = typeof module != 'undefined' && typeof module.exports != 'undefined',
      events = isNode ? require('events-manager').EventsManager : window.EventsManager;

  DependencyInjection.model('$AbstractModel', [function() {
    return function AbstractModel(modelName, nodeConstructor, browserConstructor) {

      var model;

      if (isNode && nodeConstructor) {
        var $MongoService = DependencyInjection.injector.model.get('$MongoService');

        DependencyInjection.injector.model.invoke(null, nodeConstructor, {
          model: {
            $createModel: function() {
              return function(schema) {
                model = $MongoService.model(modelName, schema);
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
