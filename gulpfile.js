const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('gulp-shell')
const csso = require('gulp-csso');
const browserSync = require('browser-sync')
const server = browserSync.create()
const purgecss = require('gulp-purgecss')
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

// Reload Callback
function reload(done) {
  server.reload()
  done()
}

// Clean
gulp.task('clean', function(){
  return del('_site/**/*', { force: true });
})

// Generate
gulp.task('generate', shell.task('eleventy'))

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

// BrowserSync Server
gulp.task('browsersync', function(done) {
  server.init({
    server: { baseDir: '_site' }
  })
  done()
})

// BrowserSync Server
gulp.task('watch', function() {
  gulp.watch('src/assets/scss/**/*', gulp.series('css:dev', reload))
  gulp.watch('src/assets/js/**/*', gulp.series('js', reload))
  gulp.watch('src/assets/images/**/*', gulp.series('images', reload))
  gulp.watch('src/**/*.{njk,html,md,json}', gulp.series('generate', reload))
})

// Serve
gulp.task('serve', gulp.parallel(
  'browsersync',
  'watch'
))

// Build
gulp.task('build:dev', gulp.series(
  'clean',
  'generate',
  'css:dev',
  'js',
  'images'
))

gulp.task('build:prod', gulp.series(
  'clean',
  'generate',
  'css:prod',
  'js',
  'images'
))
