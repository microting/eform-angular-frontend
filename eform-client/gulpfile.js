const gulp = require('gulp');
const protractor = require('gulp-protractor').protractor;


gulp.task("tests", function (done) {
  gulp.src(['e2e/**/*.js'], {read: false})
    .pipe(protractor({
        configFile: 'protractor.conf.js'
      })
    );
  done();
});
