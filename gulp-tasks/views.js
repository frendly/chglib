import gulp from "gulp";

import include from "gulp-include";
import rev from "gulp-rev-append";
import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("views-includes", () => {
  return gulp.src(paths.views.input)
      .pipe(include({
        includePaths: paths.input,
      })).on('error', console.log)
      .pipe(gulp.dest(paths.output))
});

gulp.task("views-add-hash", () => {
  return gulp.src(paths.output + '**/*.html')
      .pipe(rev())
      .pipe(gulp.dest(paths.output))
      .pipe(browsersync.stream());
});

gulp.task('views', gulp.series('views-includes', 'views-add-hash'));
