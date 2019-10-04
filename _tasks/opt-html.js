const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');

// HTML
gulp.task('html:prod', () => {
  return gulp.src('_site/**/*.html', {base: './'})
    .pipe(htmlmin({ 
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./'));
});
