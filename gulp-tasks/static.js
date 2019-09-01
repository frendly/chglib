import gulp from "gulp";

import { paths } from "../gulpfile.babel";

gulp.task("static", () =>
  gulp.src(paths.input + '.htaccess')
      .pipe(gulp.dest(paths.output))
);