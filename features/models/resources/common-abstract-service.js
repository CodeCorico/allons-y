module.exports = function() {
  'use strict';

  var isNode = typeof module != 'undefined' && typeof module.exports != 'undefined',
      events = isNode ? require('events-manager').EventsManager : window.EventsManager;

  DependencyInjection.service('$AbstractService', [function() {

    return function AbstractService() {

      events.call(this);

      this.isNode = function() {
        return isNode;
      };

      var _initFuncs = [];

      function _fireInit(callback) {
        for (var i = _initFuncs.length - 1; i >= 0; i--) {
          _initFuncs[i]();
          _initFuncs.splice(i, 1);
        }

        if (callback) {
          callback(true);
        }
      }

      this.init = function(func) {
        return new window.Ractive.Promise(function(fulfil) {
          if (func) {
            _initFuncs.push(func);

            return fulfil(true);
          }

          _fireInit(fulfil);
        });
      };

    };
  }]);

};
