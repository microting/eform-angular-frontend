// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine', '@angular/cli'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-phantomjs-launcher'),
      require('karma-junit-reporter'),
      require('@angular/cli/plugins/karma')
    ],


    /*files: [{
      pattern: './src/isChecked.ts',
      watched: false
    }],*/

    files: [
      './src/*-isChecked.ts',
      './src/test.ts'
    ],

    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },


    mime: {
      'text/x-typescript': ['ts', 'tsx']


    },
    remapIstanbulReporter: {
      reports: {
        html: './isChecked-output/coverage',
        lcovonly: './isChecked-output/coverage.lcov'
      }
    },

    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },

    junitReporter: {
      outputDir: 'isChecked-output',
      outputFile: 'unit.xml',
      suite: 'unit'
    },

    reporters: ['progress', 'karma-remap-istanbul', 'junit'],
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
