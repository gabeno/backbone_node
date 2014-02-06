var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');

gulp.task('test', function() {
  gulp.src(['tests/**/*.js', 'hello-backbone/**/*.js'])
    .pipe(watch(function(files) {
      return files
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
    }));
});

// gulp.task('default', function() {
//   // some code here
// });