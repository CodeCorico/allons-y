(function() {
  'use strict';

  window.bootstrap(['$Page', '$i18nService', '$done', function($Page, $i18nService, $done) {

    $Page.set('brand', $i18nService._('{{title}}'));
    $Page.set('apps', [{
      name: $i18nService._('Home'),
      route: '/',
      selected: true
    }]);
    $Page.set('user', {
      avatar: 'http://www.gravatar.com/avatar/9e38451efa23937301594f273033c5f1.png'
    });

    $Page.set('onloaded', function() {
      $('.start-mask').remove();
    });

    $Page.require().then($done);
  }]);

})();
