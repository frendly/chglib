import gulp from "gulp";

import { paths } from "../gulpfile.babel";

gulp.task("static", () => {
  return gulp.src(paths.input + '.htaccess')
      .pipe(gulp.dest(paths.output));
});