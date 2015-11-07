
// Require main dependencies
var del = require('del'),
    gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    open = require('gulp-open');

gulp.task('clean', function (next) {
    del('dest', function () {
        next();
    });
});

gulp.task('copyHTML', function () {
    return gulp.src('src/client/**/*.html')
        .pipe(gulp.dest('dest/client/'));
});

gulp.task('copyCSS', ['copyHTML'], function () {
    return gulp.src('src/client/**/*.css')
        .pipe(gulp.dest('dest/client/'));
});

gulp.task('build', ['copyCSS'],  function () {
    var webpack = require('gulp-webpack'),
        webpacksettings = require(process.cwd() + '/src/client/webpack.config');

    return gulp.src('src/js/')
        .pipe(webpack(webpacksettings))
        .pipe(gulp.dest('dest/client/js/'));
});

gulp.task('open', ['build'], function(){
    gulp.src('').pipe(open({
        uri: 'http://localhost:8080',
        app: 'google chrome'
    }));
});

gulp.task('test', function () {
    return gulp.src('./test/specs/**/*.spec.js')
        .pipe(mocha({
            reporter: 'spec',
            compilers: [ 'js:babel-core/register' ],
            require: ['./test/setup.js'],
            recursive: true
        }));
});

gulp.task('default', ['clean', 'build'/*, 'open'*/]);