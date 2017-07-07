const gulp = require("gulp");
const jeditor = require("gulp-json-editor");
const pm2 = require('pm2');
const git = require('gulp-git');
const install = require("gulp-install");

gulp.task("config.prod.json", function() {
    return gulp.src("./config.json")
        .pipe(jeditor({ //TODO use your configuration
            sequelize: {
                "database": "PROD",
                "username": "USER",
                "password": "PASSWORD",
            }
        }))
        .pipe(gulp.dest("."));
});

gulp.task("config.local.json", function() {
    return gulp.src("./config.json")
        .pipe(jeditor({     //TODO use your configuration
            sequelize: {
                "database": "LOCAL",
                "username": "USER",
                "password": "PASSWORD",
            }
        }))
        .pipe(gulp.dest("."));
});


gulp.task('pm2', function () {
    pm2.connect(true, function () {
        pm2.restart({
            name: 'Application Name',
            script: 'server.js'
        }, function () {
            console.log('pm2 started');
            pm2.streamLogs('all', 0);
        });
    });
});

gulp.task('pull', function(){
    git.pull('origin', 'master', {args: '--rebase'}, function (err) {
        if (err) throw err;
    });
});

gulp.task('install', function(){
    gulp.src(['./package.json'])
        .pipe(install());
});

gulp.task("prod", ["pull", "config.prod.json", "install", "pm2"], function() {
});
