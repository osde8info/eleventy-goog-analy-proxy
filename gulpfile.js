const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('gulp-shell')
const csso = require('gulp-csso');
const browserSync = require('browser-sync')
const server = browserSync.create()

// Reload Callback
function reload(done) {
    server.reload()
    done()
}

// Generate
gulp.task('generate', function() {
    shell.task('eleventy')
    shell.task('node gettweets.js')
});
gulp.task('generate', shell.task('eleventy'));

// CSS
gulp.task('css', function() {
  return gulp.src('src/assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(csso({restructure: true, debug: false}))
	.pipe(sourcemaps.write(''))
    .pipe(gulp.dest('_site/assets/css'));
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
	gulp.watch('src/assets/scss/**/*', gulp.series('css', reload))

    gulp.watch('src/**/*.{njk,html,md,json}',
        gulp.series('generate', reload)
    )
})

// Serve
gulp.task('serve', gulp.parallel('browsersync', 'watch'))

// Build
gulp.task('build', gulp.series(
  'css'
));

// Build and watch
gulp.task('dev', gulp.series(
  'build',
  'watch'
));
