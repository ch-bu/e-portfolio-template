// Libraries
import gulp from 'gulp';
import browserSync from 'browser-sync';
// import webpack from 'webpack-stream';
import htmlmin from 'gulp-htmlmin';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import size from 'gulp-size';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
// import babel from 'gulp-babel';
import del from 'del';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import $ from 'gulp-load-plugins';

// Constants
const reload = browserSync.reload;

/**
 * Compile and automatically prefix stylesheets
 */
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src(['app/scss/*.scss'])
  .pipe(newer('dist/css'))
  .pipe(sourcemaps.init())
  .pipe(sass({precision: 10}).on('error', sass.logError))
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  // // Concatenate and minify styles
  .pipe(cssnano())
  .pipe(size({title: 'styles'}))
  .pipe(sourcemaps.write('./'))
  .pipe(rename('styles.min.css'))
  .pipe(gulp.dest('dist/css'));
});

/**
 * Scan your HTML for assets & optimize them
 */
gulp.task('html', () => {
  return gulp.src('app/*.html')
    // Minify any HTML
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: false,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      // In order for the browser to reload
      // the body tag must be present
      // https://github.com/BrowserSync/browser-sync#requirements
      removeOptionalTags: false
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * Run webpack command to bundle files
 */
gulp.task('webpack', shell.task([
  'webpack']));

// Watch files for changes
gulp.task('serve', ['styles', 'webpack'], () => {
  browserSync({
      logPrefix: 'Timetracker',
      notify: true,
      port: 8082,
      server: {
        baseDir: 'dist'
      }
      // proxy: "localhost:8080",
  });

  gulp.watch(['app/scss/*.scss'], ['styles', reload]);
  gulp.watch(['app/js/**/*.jsx'], ['webpack', reload]);
  gulp.watch(['app/*.html'], ['html', reload]);
});