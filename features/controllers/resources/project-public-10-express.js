'use strict';

var path = require('path'),
    fs = require('fs'),
    publicFolder = path.resolve(__dirname, '../../public'),
    minified = process.env.MINIFIED == 'true',
    fileName = path.basename(__filename),
    projectName = fileName.split('-')[0],
    projectPublicFolder = path.join(publicFolder, projectName);

module.exports = ['$server', function($server) {

  function _sendFile(req, res, filename) {
    var sendFile = false;

    if (fs.existsSync(filename)) {
      res.sendFile(filename);
      sendFile = filename;
    }
    else {
      res
        .status(404)
        .json({
          error: 'File not found'
        });
    }
  }

  $server.use('/favicon.ico', function(req, res) {
    _sendFile(req, res, path.join(projectPublicFolder, 'favicon.ico'));
  });

  $server.use('/public', function(req, res) {

    var filename = path.join(publicFolder, req.path),
        extension = filename.split('.').pop();

    if (minified && (extension == 'js' || extension == 'css')) {
      var filenameMin = filename.substr(0, filename.length - extension.length) + 'min.' + extension;

      if (fs.existsSync(filenameMin)) {
        filename = filenameMin;
      }
    }

    _sendFile(req, res, filename);
  });
}];
