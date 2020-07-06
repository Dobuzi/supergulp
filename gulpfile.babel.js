import gulp from "gulp";
import pug from "gulp-pug";
import del from "del";
import webserver from "gulp-webserver";
import image from "gulp-image";

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build",
    },
    img: {
        src: "src/img/*",
        dest: "build/img",
    },
};

const makeHTMLfromPug = () =>
    gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const hostWebserver = () =>
    gulp.src(routes.pug.dest).pipe(webserver({ liveload: true, open: true }));

const optimizeImg = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, makeHTMLfromPug);
    gulp.watch(routes.img.src, optimizeImg);
};

const prepare = gulp.series([clean, optimizeImg]);
const assets = gulp.series([makeHTMLfromPug]);
const live = gulp.parallel([hostWebserver, watch]);

export const dev = gulp.series([prepare, assets, live]);
