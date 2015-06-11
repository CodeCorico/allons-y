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

      var _RETRY_TIME = {
            INCREMENT: 1000,
            MAX: 3000
          },

          _this = this,
          _init = false,
          _allInitFuncs = [],
          _initFuncs = [],
          _config = {};

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

      this.config = function(name, value) {
        if (typeof name == 'undefined') {
          return _config;
        }

        if (typeof value != 'undefined') {
          _config[name] = value;

          this.fire(name + 'ConfigChanged', {
            value: value
          });
        }

        return _config[name];
      };

      function _retryEmit(returnArgs, $socket, event, args, filterFunc, useFilterFunc) {
        useFilterFunc = typeof useFilterFunc == 'undefined' ? true : useFilterFunc;

        if (!returnArgs.error) {
          return;
        }

        returnArgs._message = returnArgs._message || {};
        returnArgs._message._tries = (returnArgs._message._tries || 0) + 1;

        if (!useFilterFunc || (filterFunc ? filterFunc(returnArgs) : true)) {
          args._tries = returnArgs._message._tries;

          setTimeout(function() {
            _this.retryEmitOnError($socket, event, args, filterFunc);
          }, Math.min(_RETRY_TIME.MAX, returnArgs._message._tries * _RETRY_TIME.INCREMENT));
        }
      }

      this.retryEmitOnError = function($socket, event, args, filterFunc) {
        var returnMessage = 'read(' + event.split('(')[1];

        if (!$socket.connected) {
          var returnArgs = {
            error: 'Server disconnected',
            _message: $.extend(true, {}, args)
          };

          _retryEmit(returnArgs, $socket, event, args, filterFunc, false);

          var callbacks = $socket._callbacks[returnMessage];
          if (callbacks) {
            $.each(callbacks, function(i, callback) {
              callback(returnArgs);
            });
          }

          return;
        }

        $socket.once(returnMessage, function(returnArgs) {
          _retryEmit(returnArgs, $socket, event, args, filterFunc);
        });

        $socket.emit(event, args);
      };

    };
  }]);

};
