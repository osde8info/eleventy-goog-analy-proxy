const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// JS
gulp.task('js', function () {
  return gulp.src('src/assets/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'));
});
