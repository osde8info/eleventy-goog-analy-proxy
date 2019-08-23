const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const svgSprite = require('gulp-svg-sprite');
const svgSpriteConfig = {
    mode: {
        inline: true,
        symbol: {
            dest: 'icons',
            sprite: 'icons.sprite.svg',
            example: false
        }
    },
    shape: {
        transform: ['svgo'],
        id: {
            generator: 'icon-%s'
        }
    },
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
    }
};

// Images
gulp.task('images', function (cb) {
  var assets = gulp.src('src/assets/images/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('_site/assets/images'));
  var cache = gulp.src('_cache/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('_site/assets/images/twitter'));
  var icons = gulp.src('src/assets/icons/*.svg')
      .pipe(svgSprite(svgSpriteConfig))
      .pipe(gulp.dest('_site/assets'));
  
  return merge(assets, cache, icons);
});
