import gulp from "gulp";
import pug from "gulp-pug";
import del from "del";
import webserver from "gulp-webserver";

const routes = {
    pug: {
        src: "src/*.pug",
        dest: "build",
    },
};

const makeHTMLfromPug = () =>
    gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const hostWebserver = () =>
    gulp.src(routes.pug.dest).pipe(webserver({ liveload: true, open: true }));

const prepare = gulp.series([clean]);
const assets = gulp.series([makeHTMLfromPug]);
const postDev = gulp.series([hostWebserver]);

export const dev = gulp.series([prepare, assets, postDev]);
