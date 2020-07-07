import gulp from "gulp";
import pug from "gulp-pug";
import del from "del";
import webserver from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";

sass.compiler = require("node-sass");

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
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css",
    },
};

const makeHTMLfromPug = () =>
    gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest]);

const hostWebserver = () =>
    gulp.src(routes.pug.dest).pipe(webserver({ liveload: true, open: true }));

const optimizeImg = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const makeCSSfromSCSS = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                browsers: ["last 2 versions"],
            })
        )
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, makeHTMLfromPug);
    gulp.watch(routes.img.src, optimizeImg);
    gulp.watch(routes.scss.watch, makeCSSfromSCSS);
};

const prepare = gulp.series([clean, optimizeImg]);
const assets = gulp.series([makeHTMLfromPug, makeCSSfromSCSS]);
const live = gulp.parallel([hostWebserver, watch]);

export const dev = gulp.series([prepare, assets, live]);
