var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
// var notify = require('gulp-notify');

// error handler
function handleErr(err) {
  if (err && /test?s failed/.test(err.message))
    gutil.log(err.message);
}

gulp.task('watch', function() {
  return gulp.src(['!tests/scripts/**/*', 'tests/**/*.js', 'hello-backbone/**/*.js'])
    .pipe(watch({ emit: 'all', name: 'hello-backbone' }, function(files) {
      files
        .pipe(eslint())
        .pipe(eslint.format('stylish'))
        .pipe(mocha({ reporter: 'spec' }))
        // .pipe(notify('files linted and tested :)'))
        .on('error', handleErr);
    }));
});

gulp.task('default', ['watch']);

// gutil.log => [gulp] message...
// console.log => message...
