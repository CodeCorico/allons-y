'use strict';

var PID_FILE = '.pid',
    GULP_PID_FILE = '.gulppid',

    fs = require('fs'),
    forever = require('forever-monitor'),
    pid = fs.existsSync(PID_FILE) ? fs.readFileSync(PID_FILE, 'utf-8') : null,
    gulppid = fs.existsSync(GULP_PID_FILE) ? fs.readFileSync(GULP_PID_FILE, 'utf-8') : null;

if (pid) {
  try {
    fs.unlinkSync(PID_FILE);
    forever.kill(pid);
  }
  catch (ex) {}
}

if (gulppid) {
  try {
    fs.unlinkSync(GULP_PID_FILE);
    forever.kill(gulppid);
  }
  catch (ex) {}
}
