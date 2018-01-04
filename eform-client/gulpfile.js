const Server = require('karma').Server;
const path = require('path');
const gulp = require('gulp');

gulp.task("tests", function (done) {
	new Server({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true,
	}, function(exitCode) {
		process.exit(exitCode); // <-- this is the important part
		done(exitCode);
	}).start();
});
