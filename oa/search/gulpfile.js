/**
 * Created by H5 on 2017.03.06.
 */

var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/html/search/*.js'])
        .pipe(changed('public/html/search/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/html/search/'));
});

gulp.task('default', function () {
    gulp.start('copyJS');
});