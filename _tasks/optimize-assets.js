const gulp = require('gulp');

// CSS Dependencies
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');
const purgecss = require('gulp-purgecss');
const autoprefixer = require('gulp-autoprefixer');

// JS Dependencies
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Image Dependencies
const imagemin = require('gulp-imagemin');

// CSS
gulp.task('css:dev', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csso({ restructure: true, debug: true }))
	  .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('_site/assets/css'));
})

gulp.task('css:prod', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
	  .pipe(purgecss({ content: ['_site/**/*.html'] }))
    .pipe(csso({ restructure: true, debug: false }))
	  .pipe(sourcemaps.write(''))
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
gulp.task('images', function () {
  return gulp.src('src/assets/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('_site/assets/images'));
});