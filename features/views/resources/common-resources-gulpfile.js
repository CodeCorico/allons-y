'use strict';

var path = require('path'),
    rename = require('gulp-rename');

module.exports = function resourcesDependencies(gulp) {

  var publicPath = path.resolve(__dirname, '../../public'),
      resourcesPath = path.resolve(__dirname, '../**/views/resources/*');

  gulp.task('resourcesDependencies', function(done) {
    gulp.src(resourcesPath)
      .pipe(rename(function(p) {
        var dirname = p.dirname.split(path.sep);
        dirname.pop();
        dirname.pop();

        p.dirname = dirname.join(path.sep);
      }))
      .pipe(gulp.dest(publicPath))
      .on('end', done);
  });

  return {
    task: 'resourcesDependencies',
    watch: './features/**/views/resources/*'
  };
};
