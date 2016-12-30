var gulp = require('gulp');

var shell = require('gulp-shell');

gulp.task('default', ['start-admin', 'start-screen', 'start-server'])

gulp.task('start-admin', shell.task(['yarn run dev'], {'cwd': './client-admin'}))
gulp.task('start-screen', shell.task(['yarn run dev'], {'cwd': './client-screen'}))
gulp.task('start-server', shell.task(['node server.js'], {'cwd': './server'}))
