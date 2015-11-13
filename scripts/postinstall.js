'use strict';

var path = require('path'),
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    packageSource = path.resolve(__dirname, '../../../package.json'),
    packageJSON = fs.existsSync(packageSource) ? require(packageSource) : {};

packageJSON.scripts = packageJSON.scripts || {};
packageJSON.scripts.start = 'node ./node_modules/allons-y/start.js';
packageJSON.scripts.stop = 'node ./node_modules/allons-y/stop.js';
packageJSON.scripts['allons-y'] = 'node ./node_modules/allons-y/features/cli/cli.js';

jsonfile.writeFileSync(packageSource, packageJSON, {
  spaces: 2
});
