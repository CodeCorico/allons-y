'use strict';

var path = require('path'),
    fileName = path.basename(__filename),
    projectName = fileName.split('-')[0];

module.exports = ['$server', function($server) {
  $server.use(function(req, res) {
    res.sendFile(path.resolve(__dirname, 'views/html/' + projectName + '-index.html'));
  });
}];
