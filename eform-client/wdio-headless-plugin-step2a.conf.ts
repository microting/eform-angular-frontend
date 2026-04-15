import type { Options } from '@wdio/types'

export const config: Options.Testrunner = {
    runner: 'local',
    path: '/',
    specs: [
      'e2e/Tests/kanban-settings/application-settings.plugins-page.spec.ts',
    ],
    suites: {
        settings: [
            'e2e/Tests/application-settings/**/*.spec.ts'
        ],
    },
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                'headless',
                'window-size=1920,1080',
                'disable-gpu'],
        },
    }],
    logLevel: 'silent',
    bail: 0,
    baseUrl: 'http://localhost:4200',
    waitforTimeout: 3000000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 1200000
    },
    before: function () {},
    afterTest: function (test, context, { error, result, duration, passed, retries }) {
        const path = require('path');
        if (passed) return;
        const timestamp = new Date().toLocaleString('iso', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/[ ]/g, '--').replace(':', '-');
        const filename = encodeURIComponent(
            `chrome-${timestamp}`.replace(/[/]/g, '__')
        ).replace(/%../, '.');
        const filePath = path.resolve(this.screenshotPath, `${filename}.png`);
        console.log('Saving screenshot to:', filePath);
        browser.saveScreenshot(filePath);
        console.log('Saved screenshot to:', filePath);
    },
}
