const gulp = require('gulp');
const clean = require('gulp-clean');

// deletes bin/input.txt
gulp.task('input-clean', function () {
  gulp.src('../eFormAPI/eFormAPI/bin/input.txt')
    .pipe(clean({force: true}))
});
