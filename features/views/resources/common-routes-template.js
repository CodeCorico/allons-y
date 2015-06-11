(function() {
  'use strict';

  var _routes = {{routes}},
      _controllers = {};

  window.page.controller = function(file, urls, type, func) {
    if (typeof urls == 'string') {
      urls = [urls];
    }

    var controllers = [];

    $.each(urls, function(i, url) {

      _controllers[url] = _controllers[url] || {};
      _controllers[url][file] = _controllers[url][file] || {};
      _controllers[url][file][type] = _controllers[url][file][type] || null;

      if (func) {
        _controllers[url][file][type] = func;
      }

      controllers.push(_controllers[url][file][type]);
    });

    return controllers.length === 1 ? controllers[0] : controllers;
  };

  function _createController(route, isExit) {
    var pageCall = isExit ? window.page.exit : window.page;

    if (typeof route.urls == 'string') {
      route.urls = [route.urls];
    }

    $.each(route.urls, function(i, url) {
      pageCall(url, function(context, next) {
        require(route.file).then(function() {
          var controller = window.page.controller(route.file, url, isExit ? 'exit' : 'enter');
          if (controller) {
            window.DependencyInjection.injector.view.invoke(null, controller, {
              view: {
                $context: function() {
                  return context;
                },

                $next: function() {
                  return next;
                }
              }
            });
          }
        });
      });
    });
  }

  for (var i = 0; i < _routes.length; i++) {
    var route = _routes[i];
    if (route.enter) {
      _createController(route);
    }

    if (route.exit) {
      _createController(route, true);
    }
  }

})();
