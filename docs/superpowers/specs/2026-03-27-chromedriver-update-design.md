# Remove Standalone ChromeDriver — Use WebdriverIO 9 Native Driver Management

## Problem

ChromeDriver version mismatch errors: the pinned `chromedriver ^144.0.1` npm package doesn't match the installed Chrome version, causing E2E test failures. This recurs every time Chrome updates.

## Solution

Remove the standalone `chromedriver` package and `wdio-chromedriver-service`. WebdriverIO 9.x has built-in automatic driver management that detects the installed Chrome version and downloads the matching driver on the fly.

## Changes

### 1. Package Removals (`eform-client/package.json`)

Remove these devDependencies:
- `chromedriver` (^144.0.1)
- `wdio-chromedriver-service` (8.1.1)

No new packages are added.

### 2. WebdriverIO Config Updates (14 files)

All `wdio*.conf.ts` files in `eform-client/`:
- Remove `'chromedriver'` from the `services` array
- All other config (browserName, goog:chromeOptions, headless flags, timeouts) remains unchanged

Files affected:
- `wdio.conf.ts`
- `wdio-headless.conf.ts`
- `wdio-step2.conf.ts`
- `wdio-headless-2a.conf.ts` through `wdio-headless-2j.conf.ts`
- `wdio-headless-plugin-step2.conf.ts`
- And any other `wdio*.conf.ts` variants

### 3. Legacy Cleanup

- **Delete** `eform-client/protractor.conf.js` — unused legacy file (specs commented out)
- **Remove** the `webdriver:update` gulp task from `eform-client/gulpfile.js` — references Protractor's webdriver-manager with hardcoded Chrome 2.39

### 4. No Changes Required

- CI/CD workflows (`.github/workflows/`) — run tests via npm scripts, no direct chromedriver references
- Cypress config — independent, manages its own browser
- Playwright config — independent, manages its own browser
- Jest config — unit tests, no browser involved

## How It Works After

When `wdio` runs without a chromedriver service, WebdriverIO 9's built-in driver management:
1. Detects the installed Chrome version
2. Downloads the matching chromedriver binary
3. Starts it automatically

This eliminates version mismatch permanently — no manual chromedriver version pinning needed.
