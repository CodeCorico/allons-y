module.exports = function() {
  'use strict';

  var isNode = typeof module != 'undefined' && typeof module.exports != 'undefined',
      events = isNode ? require('events-manager').EventsManager : window.EventsManager;

  DependencyInjection.model('$AbstractModel', [function() {
    return function AbstractModel(name, nodeConstructor, browserConstructor) {

      if (isNode && nodeConstructor) {
        var Waterline = require('waterline'),
            injectorModel = DependencyInjection.injector.model,
            $DatabaseService = injectorModel.get('$DatabaseService'),
            config = injectorModel.invoke(null, nodeConstructor);

        if (!config || !config.identity) {
          return console.log(new Error('Missing "identity" property in schema'));
        }

        var model = Waterline.Collection.extend(config);

        $DatabaseService.loadModel(name, config.identity, model);

        return model;
      }
      else if (!isNode && browserConstructor) {
        return function(config) {

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
    };
  }]);

};
