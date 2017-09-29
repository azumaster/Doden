var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('copyJS', function () {
    return gulp.src(['public/html/goods/*.js'])
        .pipe(changed('public/html/goods/*.js'))
        .pipe(gulp.dest('../../zdp-oa/public/html/goods/'));
});

gulp.task('default', function () {
    gulp.start('copyJS');
});