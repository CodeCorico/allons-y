'use strict';

var path = require('path'),
    fs = require('fs'),
    fileName = path.basename(__filename),
    projectName = fileName.replace(/-index-[0-9]+-express\.js/, '');

module.exports = ['$server', '$BodyDataService', function($server, $BodyDataService) {
  $server.use(function(req, res) {

    var file = path.resolve(__dirname, 'views/html/' + projectName + '-index.html'),
        html = fs.readFileSync(file, 'utf-8');

    res.send($BodyDataService.inject(html));
  });
}];
