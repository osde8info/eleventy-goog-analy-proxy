const gulp = require('gulp');

// HTML Dependencies
const htmlmin = require('gulp-htmlmin');

// CSS Dependencies
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const uncss = require('postcss-uncss');
const cssnano = require('cssnano');

// JS Dependencies
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Image Dependencies
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');

// HTML
gulp.task('html:prod', () => {
  return gulp.src('_site/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('_site'));
});

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
        ignore: [':root', '[data-theme="dark"]']
      }),
      cssnano()
    ]))
    .pipe(gulp.dest('_site/assets/css'));
})

// JS
gulp.task('js', function () {
  return gulp.src('src/assets/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'));
});

// Images
gulp.task('images', function (cb) {
  var assets = gulp.src('src/assets/images/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('_site/assets/images'));
  var cache = gulp.src('_cache/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('_site/assets/images/twitter'));
  
  return merge(assets, cache);
});
