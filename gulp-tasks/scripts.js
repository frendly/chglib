import gulp from "gulp";

import babel from "gulp-babel";
import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("scripts", () =>
  gulp.src(paths.scripts.input)
      .pipe(babel())
      .pipe(gulp.dest(paths.scripts.output))
      .on("end", browsersync.reload)
);