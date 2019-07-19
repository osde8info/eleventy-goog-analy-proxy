const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
require('require-dir')('./_tasks')

// Clean
gulp.task('clean:build', function(){  return del('_site/**/*', { force: true }); })
gulp.task('clean:cache', function(){  return del('_cache/**/*', { force: true }); })

// Build structure
gulp.task('structure', function () {
  return gulp.src('*.*', {read: false})
    .pipe(gulp.dest('./_cache'))
});

// Generate
gulp.task('generate', shell.task('eleventy'))

// Serve
gulp.task('serve', gulp.parallel(
  'browsersync',
  'watch'
))

// Build
gulp.task('build:dev', gulp.series(
  'clean:build',
  'clean:cache',
  'structure',
  'generate',
  'css:dev',
  'js',
  'images'
))

gulp.task('build:prod', gulp.series(
  'clean:build',
  'clean:cache',
  'structure',
  'generate',
  'html:prod',
  'css:prod',
  'js',
  'images'
))
