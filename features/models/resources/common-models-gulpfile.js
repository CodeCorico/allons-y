'use strict';

var path = require('path'),
    fs = require('fs'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    glob = require('glob'),
    mkdirp = require('mkdirp');

module.exports = function modelsDependencies(gulp) {

  var publicPath = path.resolve(__dirname, '../../public'),
      modelsPath = path.resolve(__dirname, '../**/models'),
      filesPattern = '*-@(factory|model|service).js';

  gulp.task('modelsDependencies', function(done) {

    glob.sync(path.join(modelsPath, filesPattern)).forEach(function(file) {
      delete require.cache[require.resolve(file)];

      var filePathArray = file.split('/'),
          filename = filePathArray.pop(),
          feature = filePathArray.pop() ? filePathArray.pop() : null,
          modelFactory = require(file).toString(),
          content = '(' + modelFactory + ')();\n',
          destPath = path.join(publicPath, feature);

      mkdirp.sync(destPath);

      fs.writeFileSync(path.join(destPath, filename), content);
    });

    gulp.src(path.join(publicPath, '**', filesPattern))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(function(file) {
        var filePath = file.path.split(path.sep);
        filePath.pop();
        filePath.pop();

        return filePath.join(path.sep);
      }))
      .on('end', done);
  });

  return {
    task: 'modelsDependencies',
    watch: './features/**/models/' + filesPattern
  };
};
