'use strict';

module.exports = function plumesDependencies(gulp) {

  gulp.task('plumesDependencies', function(done) {
    gulp.src('node_modules/plumes/public/**')
      .pipe(gulp.dest('./public/vendor/plumes/'))
      .on('end', function() {

        gulp.src([
          'node_modules/jquery/dist/jquery.js',
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/jquery/dist/jquery.min.map',
          'node_modules/ractive/ractive.js',
          'node_modules/ractive/ractive.js.map',
          'node_modules/ractive/ractive.min.js',
          'node_modules/ractive/ractive.min.js.map',
          'node_modules/ractive-require/dist/*'
        ])
          .pipe(gulp.dest('./public/vendor'))
          .on('end', done);
      });
  });

  return 'plumesDependencies';
};
