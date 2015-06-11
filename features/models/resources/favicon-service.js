module.exports = function() {
  'use strict';

  DependencyInjection.service('$FaviconService', [function() {

    return new (function $FaviconService() {

      var _$el = $('link[type="image/x-icon"], link[rel="icon"][type="image/png"]'),
          _fileUrl = _$el.attr('href');

      this.update = function(url) {
        if (_fileUrl == url) {
          return;
        }

        _fileUrl = url;
        _$el.attr('href', _fileUrl);
      };

    })();

  }]);

};
