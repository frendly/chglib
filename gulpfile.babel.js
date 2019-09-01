"use strict";

import gulp from 'gulp';
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

export { paths };
export const development = gulp.series("clean",
  gulp.parallel(["scripts", "styles", "static"]),
  gulp.parallel("views"),
  gulp.parallel("serve"),
);

// export const prod = gulp.series("clean",
//     gulp.series(["views", "styles", "gzip"]));

export default development;