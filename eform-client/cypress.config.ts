import { defineConfig } from 'cypress';
const readXlsx = require('cypress/support/read-xlsx')

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        'readXlsx': readXlsx.read
      })
    },
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1920,
    viewportHeight: 900,
    waitForAnimations: true,
    animationDistanceThreshold: 1,
    retries: {
      runMode: 0,
      openMode: 0,
    },
    watchForFileChanges: true,
    defaultCommandTimeout: 4000,
    execTimeout: 60000,
    taskTimeout: 60000,
    pageLoadTimeout: 60000,
    requestTimeout: 5000,
    responseTimeout: 30000,
    screenshotOnRunFailure: false,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    video: true,
    videoUploadOnPasses: false,
    downloadsFolder: 'cypress/downloads',
    chromeWebSecurity: true,
    experimentalOriginDependencies: true,
    scrollBehavior: 'top'
  },
});
