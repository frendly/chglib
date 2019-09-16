import gulp from "gulp";

import yaml from 'gulp-yaml';
import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("static-copy-files", () => {
  return gulp.src(paths.input + '.htaccess')
      .pipe(gulp.dest(paths.output));
});

gulp.task("static-copy-images", () => {
  return gulp.src(paths.images.input)
    .pipe(gulp.dest(paths.images.output));
});

gulp.task("yaml2json", () =>
  gulp.src(paths.data.input + '*.yml')
      .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
      .pipe(gulp.dest(paths.data.output))
      .on("end", browsersync.reload)
);

gulp.task('static', gulp.parallel('static-copy-files', 'static-copy-images', 'yaml2json'));