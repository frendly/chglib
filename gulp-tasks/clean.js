import gulp from "gulp";
import del from "del";

import { paths } from "../gulpfile.babel";

gulp.task("clean", () =>
  del([paths.output])
);