var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/html/same-goods-info/*.js'])
        .pipe(changed('public/html/same-goods-info/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/html/same-goods-info/'));
});

gulp.task('default', function () {
    gulp.start('copyJS');
});