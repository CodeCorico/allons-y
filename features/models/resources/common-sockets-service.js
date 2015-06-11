module.exports = function() {
  'use strict';

  var events = require('events-manager').EventsManager,
      extend = require('extend');

  DependencyInjection.service('$SocketsService', ['$io', function($io) {

    return new (function SocketsService() {

      events.call(this);

      var _this = this;

      this.loop = function(iterateFunc) {
        for (var sessionsName in $io.sockets.connected) {
          iterateFunc($io.sockets.connected[sessionsName], sessionsName);
        }
      };

      this.emit = function(ownerSocket, filters, socketAction, eventName, args) {
        _this.loop(function(socket) {
          var match = true,
              filter;

          if (filters) {
            for (filter in filters) {
              var filtervalue = filters[filter],
                  namespace = socket,
                  exists = true,
                  filterNamespace = filter.split('.');

              for (var i = 0; i < filterNamespace.length; i++) {
                var name = filterNamespace[i];

                if (typeof namespace[name] == 'undefined' && i < filterNamespace.length - 1) {
                  exists = false;

                  return false;
                }

                namespace = namespace[name];
              }

              if (!exists) {
                match = false;
                break;
              }
              else if (filtervalue instanceof RegExp) {
                if (!namespace.match(filtervalue)) {
                  match = false;
                  break;
                }
              }
              else if (namespace !== filtervalue) {
                match = false;
                break;
              }
            }
          }

          if (match) {
            if (socketAction) {
              socketAction(socket);
            }

            socket.emit(eventName, extend(true, {
              isOwner: ownerSocket == socket
            }, args));
          }
        });
      };

      this.error = function($socket, $message, sendEvent, errorText, extendArgs) {
        var args = {
          isOwner: true,
          error: errorText,
          _message: $message
        };

        if (extendArgs) {
          $.extend(true, args, extendArgs);
        }

        $socket.emit(sendEvent, args);
      };

    })();
  }]);

};
