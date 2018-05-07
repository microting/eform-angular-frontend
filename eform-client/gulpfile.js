const protractor = require('gulp-protractor').protractor;
const gulp = require('gulp');
const runSequence = require('run-sequence');
const spawn = require('child_process').spawn;
const clean = require('gulp-clean');

const runSpawn = function (done, task, opt_arg, opt_io) {
  opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
  var stdio = 'inherit';
  if (opt_io === 'ignore') {
    stdio = 'ignore';
  }
  var child = spawn(task, opt_arg, {stdio: stdio});
  var running = false;
  child.on('close', function () {
    if (!running) {
      running = true;
      done();
    }
  });
  child.on('error', function () {
    if (!running) {
      console.error('gulp encountered a child error');
      running = true;
      done();
    }
  });
};

gulp.task('webdriver:update', function (done) {
  runSpawn(done, 'node', ['./node_modules/protractor/bin/webdriver-manager', 'update']);
});

gulp.task('tests', function (done) {
  runSequence(['webdriver:update'], "e2e-tests", done);
});

gulp.task("e2e-tests", function (done) {
  gulp.src(['e2e/!**!/!*.js'], {read: false})
    .pipe(protractor({
        configFile: 'protractor.conf.js'
      })
    );
  done();
});
// deletes bin/input.txt
gulp.task('input-clean', function () {
  gulp.src('../eFormAPI/eFormAPI/bin/input.txt')
    .pipe(clean({force: true}))
});
