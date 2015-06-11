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


      var _this = this,
          _init = false,
          _allInitFuncs = [],
          _initFuncs = [];

      function _fireInit(args, callback) {
        for (var i = _initFuncs.length - 1; i >= 0; i--) {
          _initFuncs[i](args);
          _initFuncs.splice(i, 1);
        }

        if (callback) {
          callback(true);
        }
      }

      this.isInit = function() {
        return _init;
      };

      this.init = function(funcOrArgs) {
        _init = true;

        return new window.Ractive.Promise(function(fulfil) {
          if (typeof funcOrArgs == 'function') {
            _initFuncs.push(funcOrArgs);
            _allInitFuncs.push(funcOrArgs);

            return fulfil(true);
          }

          _fireInit(funcOrArgs, fulfil);
        });
      };

      function _tearDown(callback) {
        _this.fire('teardown');
        _initFuncs = $.extend(true, [], _allInitFuncs);

        if (callback) {
          callback();
        }
      }

      this.teardown = function(callback) {
        _init = false;

        var beforeTeardowns = _this.fire('beforeTeardown');

        if (beforeTeardowns && beforeTeardowns.length) {
          window.async.eachSeries(beforeTeardowns, function(beforeTeardown, next) {
            beforeTeardown(next);
          },

          function() {
            _tearDown(callback);
          });

          return;
        }

        _tearDown(callback);
      };
    };
  }]);

};
