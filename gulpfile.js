const {gulp, src, dest, watch, series, parallel} = require('gulp');
const include = require('gulp-include');
const del = require('del');

const paths = {
  // input: 'src/',
  input: 'lib6.html',
  output: 'dist/',
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
  return src(paths.input)
          .pipe(include())
            .on('error', console.log)
          .pipe(dest(paths.output))
};


exports.default = series(
  cleanDist,
  htmlIncludes,
);