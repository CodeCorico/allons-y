'use strict';

module.exports = function mvwInjectionDependencies(gulp) {

  gulp.task('mvwInjectionDependencies', function(done) {
    gulp.src([
      'node_modules/mvw-injection/dist/dependency-injection.js',
      'node_modules/mvw-injection/dist/dependency-injection.min.js',
      'node_modules/mvw-injection/dist/dependency-injection.min.js.map',
      'node_modules/mvw-injection/dist/mvc-injection.js',
      'node_modules/mvw-injection/dist/mvc-injection.min.js',
      'node_modules/mvw-injection/dist/mvc-injection.min.js.map',
      'node_modules/mvw-injection/dist/mvvm-injection.js',
      'node_modules/mvw-injection/dist/mvvm-injection.min.js',
      'node_modules/mvw-injection/dist/mvvm-injection.min.js.map'
    ])
      .pipe(gulp.dest('./public/vendor'))
      .on('end', done);
  });

  return 'mvwInjectionDependencies';
};
