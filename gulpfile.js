const {gulp, src, dest, watch, series, parallel} = require('gulp');
const include = require('gulp-include');
const prettyHtml = require('gulp-pretty-html');
const del = require('del');
const browserSync = require('browser-sync');
const rev = require('gulp-rev-append');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');


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

function tarball() {
  return src(paths.output + '**/*')
    .pipe(tar('dist.tar'))
    .pipe(gzip())
    .pipe(dest(paths.output));
};

exports.pretty = gulpPrettyHtml;

exports.default = series(
  cleanDist,
  htmlIncludes,
  copyJS,
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
