'use strict';

var PID_FILE = '.pid',

    fs = require('fs'),
    execSync = require('child_process').execSync,
    forever = require('forever-monitor');

execSync('node stop.js');

execSync('node evolve.js');

forever.start(['env', 'gulp'], {});

fs.writeFileSync(PID_FILE, process.pid);
