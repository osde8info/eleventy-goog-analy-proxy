const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
require('require-dir')('./_tasks')

// Clean
gulp.task('clean', function(){  return del('_site/**/*', { force: true }); })

// Generate
gulp.task('generate', shell.task('eleventy'))

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
