import gulp from "gulp";

import include from "gulp-include";
import browsersync from "browser-sync";
import replace from "gulp-manifest-replace";

import manifestJson from '../dist/assets/manifest.json';

import { paths } from "../gulpfile.babel";

gulp.task("views-includes", () =>
  gulp.src([
    paths.views.input,
    '!src/components/**/*',
    '!src/OLD/**/*',
    '!src/_data/**/*',
    '!src/_includes/**/*',
    '!src/_about/**/*',
    '!src/_contacts/**/*',
  ])
    .pipe(include({
      includePaths: paths.input,
    })).on('error', console.log)
    .pipe(gulp.dest(paths.output))
);

gulp.task("views-add-hash", () =>
  gulp.src(paths.output + '**/*.html')
    .pipe(replace({ manifest: manifestJson }))
    .pipe(gulp.dest(paths.output))
    .on("end", browsersync.reload)
);

gulp.task('views', gulp.series('views-includes', 'views-add-hash'));
