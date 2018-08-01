const gulp = require('gulp');

const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const packageImporter = require('node-sass-package-importer');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const webpack = require("webpack");
const webpackStream = require("webpack-stream");


gulp.task('server', ['html', 'styles', 'scripts'], () => {
  browserSync.init({
    server: {
      baseDir: ['./wordpress/__templates', './wordpress/'],
      directory: true
    },
    port: 8888,
    ghostMode: true,
    open: false,
    notify: false
  });
});


gulp.task('html', () => {
  gulp.src(['./frontend/**/*.html'])
    .pipe(plumber())
    .pipe(gulp.dest('./wordpress/__templates'))
    .pipe(browserSync.stream());
});


gulp.task('styles', () => {
  gulp.src('frontend/assets/styles/index.scss')
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass({
      importer: packageImporter({
        extensions: ['.scss', '.css']
      })
    }).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(autoPrefixer())
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest('./wordpress/assets/css/'))
    .pipe(browserSync.stream());
});


gulp.task('scripts.dll', function (callback) {
  const webpackConfig = require("./webpack.dll.config");

  webpack(webpackConfig).run((err, stats) => {
    if (err) {
      throw err;
    }

    console.log(stats.toString('minimal'));

    callback();
  });
});


gulp.task('scripts', ['scripts.dll'], function () {
  const webpackConfig = require("./webpack.config");

  gulp.src('frontend/assets/scripts/common.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(plumber())
    .pipe(gulp.dest('./wordpress/assets/js'));
});


gulp.task('watch', () => {
  gulp.watch('frontend/**/*.html', ['html']);
  gulp.watch('frontend/assets/styles/**/*.scss', ['styles']);
});


gulp.task('default', ['server', 'watch']);
