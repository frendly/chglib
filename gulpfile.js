const {gulp, src, dest, watch, series, parallel} = require('gulp');

const del = require('del');
const browserSync = require('browser-sync');
const rev = require('gulp-rev-append');

// html
const include = require('gulp-include');
const prettyHtml = require('gulp-pretty-html');

// zip
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');


const paths = {
  input: 'src/',
  output: 'dist/',
  html: {
    input: 'src/**/*.html',
  },
  scripts: {
    input: 'src/assets/js/*',
    output: 'dist/assets/js/'
  },
  styles: {
    input: 'src/assets/styles/**/*.scss',
    output: 'dist/assets/styles/'
  },
  reload: './dist/'
}

function cleanDist (done) {
  // Clean the dist folder
  del.sync([
    paths.output
  ]);

  // Signal completion
  return done();
};

function htmlIncludes() {
  return src(paths.html.input)
          .pipe(include({
            includePaths: paths.input,
          }))
            .on('error', console.log)
          .pipe(dest(paths.output))
};

function addHash() {
  return src(paths.output + '*.html')
          .pipe(rev())
          .pipe(dest(paths.output))
};

function gulpPrettyHtml() {
  return src(paths.html.input)
          .pipe(prettyHtml())
          .pipe(dest(paths.input))
};

// Copy js files into output folder
function copyJS (done) {

  // Copy static files
  return src(paths.scripts.input)
          .pipe(dest(paths.scripts.output));
};

// Watch for changes to the src directory
function startServer (done) {

  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: paths.reload
    }
  });

  // Signal completion
  done();
};

// Reload the browser when files change
function reloadBrowser (done) {
  browserSync.reload();
  done();
};

// Watch for changes
function watchSource (done) {
  watch(paths.input, series(exports.default, reloadBrowser));
  done();
};

// zip
function tarball() {
  return src(paths.output + '**/*')
    .pipe(tar('dist.tar'))
    .pipe(gzip())
    .pipe(dest(paths.output));
};

// Process, lint, and minify Sass files
function buildStyles (done) {
  // Run tasks on all Sass files
  return src(paths.styles.input)
          .pipe(sass({
            outputStyle: 'expanded',
            sourceComments: true
          }))
          .pipe(prefix())
          .pipe(dest(paths.styles.output))
          .pipe(minify({
            discardComments: {
              removeAll: true,
            }
          }))
          .pipe(dest(paths.styles.output));
};

exports.pretty = gulpPrettyHtml;

exports.default = series(
  cleanDist,
  htmlIncludes,
  copyJS,
  buildStyles,
  addHash,
);

// Watch and reload
exports.watch = series(
  exports.default,
  startServer,
  watchSource,
);

// gzip
exports.tarball = series(
  exports.default,
  tarball,
);
