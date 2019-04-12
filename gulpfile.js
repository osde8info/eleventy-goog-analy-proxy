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

// Reload Callback
function reload(done) {
  server.reload()
  done()
}

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
  gulp.watch('src/**/*.{njk,html,md,json}', gulp.series('generate', reload))
})

// Serve
gulp.task('serve', gulp.parallel(
  'browsersync',
  'watch'
))

// Build
gulp.task('build:dev', gulp.series(
  'generate',
  'css:dev',
  'js'
))

gulp.task('build:prod', gulp.series(
  'generate',
  'css:prod',
  'js'
))
