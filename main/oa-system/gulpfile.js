/**
 * Created by H5 on 2017.03.06.
 */

var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/js/*.js'])
        .pipe(changed('public/js/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/js'));
});

gulp.task('copyCSS', function () {
    return gulp.src('public/css/*.css')
        .pipe(changed('public/css/*.css'))
        .pipe(gulp.dest('../../zdp-oa/public/css'));
});

gulp.task('default', function () {
    gulp.start('copyJS', 'copyCSS');
});