const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const uncss = require('postcss-uncss');
const cssnano = require('cssnano');

// CSS
gulp.task('css:dev', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sass({ outputStyle: 'nested' }).on('error', sass.logError))
	  .pipe(postcss([
      autoprefixer() 
    ]))
    .pipe(gulp.dest('_site/assets/css'));
})

gulp.task('css:prod', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	  .pipe(postcss([
      autoprefixer(),
      uncss({ 
        html: ['_site/**/*.html'],
        ignore: [
          ':root',
          '[data-theme="dark"]',
          '.loaded .content-header',
          '.loaded .content',
          '[data-theme="dark"] .icon-sun',
          '[data-theme="dark"] .icon-moon'
        ]
      }),
      cssnano()
    ]))
    .pipe(gulp.dest('_site/assets/css'));
})