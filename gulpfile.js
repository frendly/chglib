const {gulp, src, dest, watch, series, parallel} = require('gulp');
const include = require('gulp-include');
const prettyHtml = require('gulp-pretty-html');
const del = require('del');
const browserSync = require('browser-sync');

const paths = {
  input: 'src/',
  output: 'dist/',
  html: {
    input: 'src/**/*.html',
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

function gulpPrettyHtml() {
  return src(paths.html.input)
          .pipe(prettyHtml())
          .pipe(dest(paths.input))
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


exports.pretty = gulpPrettyHtml;
exports.default = series(
  cleanDist,
  htmlIncludes,
);

// Watch and reload
exports.watch = series(
  exports.default,
  startServer,
  watchSource
);