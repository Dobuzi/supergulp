import gulp from "gulp";
import pug from "gulp-pug";
import del from "del";
import webserver from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

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
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js",
    },
    clean: ["build/", ".publish"],
    deploy: {
        src: "build/**/*",
    },
};

const makeHTMLfromPug = () =>
    gulp.src(routes.pug.src).pipe(pug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(routes.clean);

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
                overrideBrowserslist: ["last 2 versions"],
            })
        )
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));

const makeJS = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }],
                ],
            })
        )
        .pipe(gulp.dest(routes.js.dest));

const deployGhPages = () => gulp.src(routes.deploy.src).pipe(ghPages());

const watch = () => {
    gulp.watch(routes.pug.watch, makeHTMLfromPug);
    gulp.watch(routes.img.src, optimizeImg);
    gulp.watch(routes.scss.watch, makeCSSfromSCSS);
    gulp.watch(routes.js.watch, makeJS);
};

const prepare = gulp.series([clean, optimizeImg]);
const assets = gulp.series([makeHTMLfromPug, makeCSSfromSCSS, makeJS]);
const live = gulp.parallel([hostWebserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, deployGhPages, clean]);
