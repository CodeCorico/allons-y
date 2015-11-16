'use strict';

var path = require('path');

module.exports = new (function() {

  require(path.resolve(__dirname, 'allons-y-glob.js')).apply(this);

  var _this = this;

  this.start = function() {
    console.log('START');

    // DependencyInjection

    var files = _this.filesSyncSortered('*allons-y-bootstrap.js');

    console.log(files);
  };

  this.stop = function() {
    console.log('STOP');
  };

})();
