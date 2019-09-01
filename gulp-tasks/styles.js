import gulp from "gulp";

import sass from "gulp-sass";
import prefix from "gulp-autoprefixer";
import minify from "gulp-cssnano";
import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("styles", () => {
  return gulp.src(paths.styles.input)
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
      .pipe(browsersync.stream());
});