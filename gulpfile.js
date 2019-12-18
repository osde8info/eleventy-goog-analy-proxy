const gulp = require('gulp');
const shell = require('gulp-shell');
const del = require('del');
require('./_tasks/browsersync.js');
require('./_tasks/opt-css.js');
require('./_tasks/opt-html.js');
require('./_tasks/opt-images.js');
require('./_tasks/opt-js.js');

// Clean
gulp.task('clean:build', function(){  return del('_site/**/*', { force: true }); })

// Generate
gulp.task('generate', shell.task('eleventy'))

// Serve
gulp.task('serve', gulp.parallel(
  'browsersync',
  'watch'
))

// Build
gulp.task('build:dev', gulp.series(
//  'clean:build',
//  'clean:cache',
  'generate',
  'css:dev',
  'js',
  'icons'
))

gulp.task('build:prod', gulp.series(
  'clean:build',
  'generate',
  'html:prod',
  'css:prod',
  'js',
  'icons',
  'images'
))
