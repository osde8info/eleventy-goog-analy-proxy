var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

/*
  CSS
*/
gulp.task('css', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(sourcemaps.write(''))
    .pipe(gulp.dest('_site/assets/css'));
});

/*
  Watch folders for changess
*/
gulp.task("watch", function() {
  gulp.watch('src/scss/*.scss', gulp.parallel('css'));
});

/*
  Build
*/
gulp.task('build', gulp.parallel(
  'css'
));

/*
  Build and watch
*/
gulp.task('dev', gulp.series(
  'build',
  'watch'
));