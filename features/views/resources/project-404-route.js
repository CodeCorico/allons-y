'use strict';

module.exports = {
  url: '*',
  priority: 'min',

  enter: ['$Page', '$context', '$next', function($Page, $context, $next) {

  }],

  exit: ['$Page', '$context', '$next', function($Page, $context, $next) {
    $next();
  }]
};
