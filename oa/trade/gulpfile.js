/**
 * Created by H5 on 2017.03.06.
 */

var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/html/trade/*.js'])
        .pipe(changed('public/html/trade/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/html/trade/'));
});

gulp.task('default', function () {
    gulp.start('copyJS');
});