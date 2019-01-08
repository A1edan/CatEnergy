const gulp = require(`gulp`);
const sass = require(`gulp-sass`);
const pug = require(`gulp-pug`);
const browserSync = require(`browser-sync`).create();
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const autoprefixer = require(`gulp-autoprefixer`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`imagemin-webp`);
const jpegoptim = require(`imagemin-jpegoptim`);


const path = {
  style: {
    sassFiles: [`./app/dev/sass/**/*.scss`],
    startFile: [`./app/dev/sass/style.scss`],
		convertFolder: [`./app/static/css`]
	},

  pug: {
    pugFiles: [`./app/dev/pug/**/*.pug`],
    startFile: [`./app/dev/pug/pages/*.pug`],
    convertFolder: [`./app/static`]
  }
};

gulp.task(`sass`, () => {
  return gulp.src(path.style.startFile)
    .pipe(sass())
    .pipe(gulp.dest(path.style.convertFolder))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest(path.style.convertFolder))
});

gulp.task(`pug`, () => {
  return gulp.src(path.pug.startFile)
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest(path.pug.convertFolder))
});

gulp.task(`watch`, () => {
  return browserSync.init({
    server: path.pug.convertFolder
  });
  gulp.watch(path.style.sassFiles, gulp.series(`sass`)).on(`change`, browserSync.reload);
  gulp.watch(path.pug.pugFiles, gulp.series(`pug`)).on(`change`, browserSync.reload);
});

gulp.task(`images`, () => {
  return gulp.src(`app/static/img_original/**/*`)
    .pipe(
      imagemin([
        imagemin.optipng({
          optimizationLevel: 3
        }),

        jpegoptim({
          max: 80,
          progressive: true
        }),

        imagemin.svgo({
          plugins: [{
            removeViewBox: false
          },
          {
            removeTitle: true
          },
          {
          cleanupNumericValues: {
            floatPrecision: 0
          }
        }]
      })
    ], {
      verbose: true
    })
  )
  .pipe(gulp.dest(`app/static/img`));
  });

gulp.task(`webp`, function () {
  return gulp
      .src(`app/static/img_original/**/*.{jpg,jpeg,gif,png}`)
      .pipe(imagemin([webp({
        quality: 75
      })]))
      .pipe(rename({
        extname: `.webp`
      }))
      .pipe(gulp.dest(`app/static/img`));
});
