module.exports = function() {
  'use strict';

  DependencyInjection.service('$i18nService', [function() {
    return new (function $i18nService() {

      this._ = function(text) {
        return text;
      };

    })();
  }]);

};
