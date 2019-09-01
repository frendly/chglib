import gulp from "gulp";

import tar from "gulp-tar";
import gzip from "gulp-gzip";

import { paths } from "../gulpfile.babel";

gulp.task("gzip", () => {
  return gulp.src(paths.output + '**/*', {dot: true})
      .pipe(tar('dist.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(paths.output));
});