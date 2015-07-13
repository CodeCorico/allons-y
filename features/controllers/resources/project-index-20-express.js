'use strict';

var path = require('path'),
    fs = require('fs'),
    fileName = path.basename(__filename),
    projectName = fileName.replace('-index-20-express.js', '');

module.exports = ['$server', '$BodyData', function($server, $BodyData) {
  $server.use(function(req, res) {

    var file = path.resolve(__dirname, 'views/html/' + projectName + '-index.html'),
        html = fs.readFileSync(file, 'utf-8');

    res.send($BodyData.inject(html));
  });
}];
