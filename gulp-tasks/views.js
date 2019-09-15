import gulp from "gulp";

import include from "gulp-include";
import rev from "gulp-rev-append";
import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("views-includes", () =>
  gulp.src([
    paths.views.input,
    '!src/components/**/*',
    '!src/OLD/**/*',
  ])
      .pipe(include({
        includePaths: paths.input,
      })).on('error', console.log)
      .pipe(gulp.dest(paths.output))
);

gulp.task("views-add-hash", () =>
  gulp.src(paths.output + '**/*.html')
      .pipe(rev())
      .pipe(gulp.dest(paths.output))
      .on("end", browsersync.reload)
);

gulp.task('views', gulp.series('views-includes', 'views-add-hash'));
