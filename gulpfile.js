var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');

gulp.task('test', function() {
  gulp.src(['tests/**/*.js'])
    .pipe(watch(function(files) {
      return files
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
    }));
});

// gulp.task('default', function() {
//   // some code here
// });