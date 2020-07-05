import gulp from "gulp";
import pug from "gulp-pug";
import del from "del";

const routes = {
    pug: {
        src: "src/*.pug",
        dest: "build",
    },
};

const makeHTMLfromPug = () =>
    gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const prepare = gulp.series([clean]);

const assets = gulp.series([makeHTMLfromPug]);

export const dev = gulp.series([prepare, assets]);
