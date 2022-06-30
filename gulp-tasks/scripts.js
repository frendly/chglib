import gulp from "gulp";

import webpack from "webpack";
import webpackStream from "webpack-stream";
import browsersync from "browser-sync";

const webpackConfig = require("../webpack.config.js");

import { paths } from "../gulpfile.babel";

gulp.task("scripts", () =>
  gulp.src(paths.scripts.input)
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(paths.scripts.output))
    .on("end", browsersync.reload)
);
