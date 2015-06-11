'use strict';

var fs = require('fs'),
    path = require('path'),
    dotenv = require('dotenv'),
    envFile = path.join(__dirname, '.env'),
    evolv = require('evolv'),
    lastVersionApplied = '0.0.0';

if (fs.existsSync(envFile)) {
  var env = dotenv.parse(fs.readFileSync(envFile));
  if (env) {
    lastVersionApplied = env.LAST_VERSION_APPLIED || lastVersionApplied;
  }
}

evolv(null, lastVersionApplied, function(actualVersion, newVersion) {
  env = env || {};
  env.LAST_VERSION_APPLIED = newVersion;

  fs.writeFileSync(envFile, Object.keys(env).map(function(key) {
    return key + '=' + env[key];
  }).join('\n'));
});
