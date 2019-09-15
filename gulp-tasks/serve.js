import gulp from "gulp";

import browsersync from "browser-sync";

import { paths } from "../gulpfile.babel";

gulp.task("serve", () => {
    browsersync.init({
        server: { baseDir: paths.reload }
    });

    gulp.watch(paths.views.watch, gulp.parallel("views"));
    gulp.watch(paths.styles.watch, gulp.parallel("styles"));
    gulp.watch(paths.scripts.watch, gulp.parallel("scripts"));
    gulp.watch(paths.data.watch, gulp.parallel("static"));
});