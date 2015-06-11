'use strict';

var fs = require('fs'),
    execSync = require('child_process').execSync,
    forever = require('forever-monitor'),
    pidFile = 'pid',
    pid = fs.existsSync(pidFile) ? fs.readFileSync(pidFile, 'utf-8') : null;

if (pid) {
  try {
    fs.unlinkSync(pidFile);
    execSync('kill -TERM -' + pid + ' 2>&1');
  }
  catch (ex) {}
}

execSync('node evolve.js');

var child = forever.start(['env', 'gulp'], {});

fs.writeFileSync('pid', child.child.pid);
