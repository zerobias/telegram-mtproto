var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('quality', function () {
    return gulp.src('./lib/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    return gulp.src('./test/**/*test.js')
        .pipe(mocha({reporter: 'mocha-better-spec-reporter', timeout: '90s'}));
});

gulp.task('cover', function () {
    return gulp.src('./test/**/*test.js')
        .pipe(mocha({reporter: 'mocha-lcov-reporter', timeout: '90s'}));
});

gulp.task('default', ['quality', 'test']);