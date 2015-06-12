'use strict';

var sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

module.exports = function asyncDependencies(gulp) {

  gulp.task('asyncDependencies', function(done) {
    gulp
      .src(['node_modules/async/lib/async.js'])
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

  return 'asyncDependencies';
};
