const {gulp, src, dest, watch, series, parallel} = require('gulp');
const include = require('gulp-include');
const del = require('del');

const paths = {
  input: 'src/',
  output: 'dist/',
  html: {
    input: 'src/**/*.html',
  }
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


exports.default = series(
  cleanDist,
  htmlIncludes,
);