'use strict';

var sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

module.exports = function socketioDependencies(gulp) {

  gulp.task('socketioDependencies', function(done) {
    gulp
      .src(['node_modules/socket.io/node_modules/socket.io-client/socket.io.js'])
      .pipe(gulp.dest('./public/vendor'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/vendor'))
      .on('end', done);
  });

  return 'socketioDependencies';
};
