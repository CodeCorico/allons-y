'use strict';

var PID_FILE = '.gulppid',

    fs = require('fs'),
    dotenv = require('dotenv');

if (!fs.existsSync('.env')) {
  return console.log('\nYour environnement is not configured. Please use: "allons-y env"\n');
}

dotenv.load();

fs.writeFileSync(PID_FILE, process.pid);

var Plumes = require('plumes'),
    gulp = require('gulp'),
    glob = require('glob'),
    extend = require('extend'),
    files = glob.sync('./features/**/*-gulpfile.js'),
    defaultTasks = [],
    watchs = [];

function _sortByFilePriority(a, b) {
  var priorities = [999, 999],
      files = [a.split('-'), b.split('-')],
      priority = null;

  for (var i = 0; i < files.length; i++) {
    files[i].pop();
    priority = parseFloat(files[i].pop());
    if (!isNaN(priority)) {
      priorities[i] = priority;
    }
  }

  if (priorities[0] < priorities[1]) {
    return -1;
  }

  if (priorities[0] > priorities[1]) {
    return 1;
  }

  return 0;
}

files.sort(_sortByFilePriority);

files.forEach(function(file) {
  var tasks = require(file)(gulp, extend(true, [], defaultTasks));
  if (tasks && typeof tasks == 'string') {
    tasks = [tasks];
  }
  else if (tasks && typeof tasks == 'object') {
    if (Object.prototype.toString.call(tasks) == '[object Object]') {
      if (tasks.watch && tasks.task) {
        var watch = tasks.watch,
            task = tasks.task;

        watchs.push(function() {
          gulp.watch(watch, [task]);
        });
      }

      if (tasks.task) {
        tasks = [tasks.task];
      }
      else {
        tasks = null;
      }
    }
  }
  else {
    return;
  }

  if (tasks && tasks.length) {
    defaultTasks = defaultTasks.concat(tasks);
  }
});

new Plumes(gulp, {
  path: {
    less: './features/**/views/css/*.less',
    js: './features/**/views/*.js',
    html: './features/**/views/html/*.html',
    public: './public'
  },
  default: defaultTasks,
  watcher: process.env.WATCHER == 'true',
  watchs: watchs
});
