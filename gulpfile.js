var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', function () {    // 这里的watch，是自定义的，写成live或者别的也行
    var server = livereload();
    livereload.listen();
    gulp.watch(['public/**/**/*.*','views/*']).on('change', livereload.changed);
});
