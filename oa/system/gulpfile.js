/**
 * Created by H5 on 2017.03.06.
 */

var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/html/system/*.js'])
        .pipe(changed('public/html/system/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/html/system/'));
});

gulp.task('default', function () {
    gulp.start('copyJS');
});