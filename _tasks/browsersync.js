const gulp = require('gulp');
const browserSync = require('browser-sync');
const server = browserSync.create();

// Reload Callback
function reload(done) {
  server.reload()
  done()
}

// BrowserSync Server
gulp.task('browsersync', function(done) {
  server.init({
    server: { baseDir: '_site' },
    startPath: "/en"
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