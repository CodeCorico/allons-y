module.exports = function() {
  'use strict';

  var isNode = typeof module != 'undefined' && typeof module.exports != 'undefined';

  DependencyInjection.service('$BodyDataService', [function() {

    return new (function BodyDataService() {

      var _data = {},
          _$body = isNode ? null : $('body');

      this.data = function(name, value) {
        if (isNode) {
          if (name) {
            if (typeof value != 'undefined') {
              _data[name] = value;
            }

            return _data[name];
          }

          return _data;
        }

        if (name) {
          if (typeof value != 'undefined') {
            _$body.data(name, value);
          }

          return _$body.data(name);
        }

        return _$body.data();
      };

      this.inject = function(html) {
        var dataAttributes = [];

        Object.keys(_data).forEach(function(name) {
          dataAttributes.push('data-' + name + '=\'' + JSON.stringify(_data[name]).replace(/'/g, '\\\'') + '\'');
        });

        return html.replace(/(<body.*?>)/, function(text) {
          return text.substr(0, text.length - 1) + (dataAttributes.length ? ' ' + dataAttributes.join(' ') : '') + '>';
        });
      };

    })();

  }]);

};
