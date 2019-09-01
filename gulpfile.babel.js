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
    input: 'src/assets/js/main.js',
    output: 'dist/assets/js/',
    watch: 'src/**/*.js',
  },
  styles: {
    input: 'src/assets/styles/main.scss',
    output: 'dist/assets/styles/',
    watch: 'src/**/*.scss',
  },
  reload: './dist/'
}

requireDir("./gulp-tasks/");

const build = series("clean",
  parallel(["scripts", "styles", "static"]),
  "views",
);

const watch = series("clean",
  parallel(["scripts", "styles", "static"]),
  "views",
  "serve",
);

const gzip = series("clean",
  parallel(["scripts", "styles", "static"]),
  "views",
  "gzip",
);

export { build as default, watch, gzip, paths };