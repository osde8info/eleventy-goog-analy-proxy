const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');

// HTML
gulp.task('html:prod', () => {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({ 
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('_site'));
});
