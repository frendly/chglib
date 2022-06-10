import gulp from "gulp";
import prefix from "gulp-autoprefixer";
import minify from "gulp-cssnano";
import browsersync from "browser-sync";
import dartSass from "sass";
import gulpSass from "gulp-sass";

import { paths } from "../gulpfile.babel";

const sass = gulpSass(dartSass);

gulp.task("styles", () =>
  gulp.src(paths.styles.input)
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(prefix())
    .pipe(gulp.dest(paths.styles.output))
    .pipe(minify({
      discardComments: {
        removeAll: true,
      }
    }))
    .pipe(gulp.dest(paths.styles.output))
    .pipe(browsersync.stream())
);
