"use strict";

import { series, parallel } from 'gulp';
import requireDir from "require-dir";

const paths = {
  input: 'src/',
  output: 'dist/',
  views: {
    input: 'src/**/*.html',
    watch: 'src/**/*.html',
  },
  scripts: {
    input: 'src/assets/js/index.js',
    output: 'dist/assets/js/',
    watch: 'src/**/*.js',
  },
  styles: {
    input: 'src/assets/styles/index.scss',
    output: 'dist/assets/styles/',
    watch: 'src/**/*.scss',
  },
  data: {
    input: 'src/assets/data/',
    output: 'dist/assets/data/',
    watch: 'src/assets/data/*.*',
  },
  images: {
    input: 'src/assets/images/**/*',
    output: 'dist/assets/images/',
    watch: 'src/assets/images/**/*.*',
  },
  reload: './dist/'
}

requireDir("./gulp-tasks/");

const build = series(
  "static",
  "views",
);

const watch = series(
  "static",
  "views",
  "serve",
);

const gzip = series(
  "static",
  "views",
  "gzip",
);

export { build as default, watch, gzip, paths };
