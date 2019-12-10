const gulp = require('gulp');
const responsive = require('gulp-responsive');
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

// Icons
gulp.task('icons', () => {
  return gulp.src('src/assets/icons/*.svg')
  .pipe(svgSprite(svgSpriteConfig))
  .pipe(gulp.dest('_site/assets'))
});

// Media images
gulp.task('images', () => {
  return gulp.src('_site/assets/media/**/*.*', {base: './'})
  .pipe(responsive({
    '**/*.*': [
      {
        rename: { suffix: '-original' }
      }, {
        rename: { suffix: '-original' },
        format: 'webp'
      }, {
        width: 320,
        rename: { suffix: '-320' },
        format: 'webp'
      }, {
        width: 480,
        rename: { suffix: '-480' },
        format: 'webp'
      }, {
        width: 768,
        rename: { suffix: '-768' },
        format: 'webp'
      }
    ]
  }, {
    quality: 70,
    progressive: true,
    withMetadata: false,
    skipOnEnlargement: false,
    errorOnEnlargement: false,
    errorOnUnusedConfig: false,
    errorOnUnusedImage: false
  }))
  .pipe(gulp.dest('./'));
});
