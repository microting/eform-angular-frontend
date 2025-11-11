# eForm Angular Frontend

[![Master/Stable](https://github.com/microting/eform-angular-frontend/actions/workflows/dotnet-core-master.yml/badge.svg?branch=stable)](https://github.com/microting/eform-angular-frontend/actions/workflows/dotnet-core-master.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/383f012a79c7bea1101e/maintainability)](https://codeclimate.com/github/microting/eform-angular-frontend/maintainability)

eForm Backend is created using Angular 19 and C\# .Net Core 9

## Translating eForm Angular Frontend

| Language | C\# part | Angular part |
| :--- | :---: | :---: |
| Bulgarian | 100% | 100% |
| Croatian | 100% | 100% |
| Czech | 100% | 100% |
| Danish | 100% | 100% |
| Dutch | 100% | 100% |
| English | 100% | 100% |
| Estonian | 100% | 100% |
| Finish | 100% | 100% |
| French | 100% | 100% |
| German | 100% | 100% |
| Greek | 100% | 100% |
| Hungarian | 100% | 100% |
| Icelandic | 100% | 100% |
| Italian | 100% | 100% |
| Latvian | 100% | 100% |
| Lithuanian | 100% | 100% |
| Norwegian | 100% | 100% |
| Polish | 100% | 100% |
| Portuguese | 100% | 100% |
| Romanian | 100% | 100% |
| Slovak | 100% | 100% |
| Slovenian | 100% | 100% |
| Spanish | 100% | 100% |
| Swedish | 100% | 100% |
| Turkish | 100% | 100% |
| Ukrainian | 100% | 100% |

If you want to contribute with a translation to another language, please start by cloning the repository and create a copy of [SharedResource.resx](https://github.com/microting/eform-angular-frontend/blob/master/eFormAPI/eFormAPI.Web/Resources/SharedResource.resx) and name it SharedResource.XX.resx where XX is the language code. For the Angular part, please create a copy of [en-US.json](https://github.com/microting/eform-angular-frontend/blob/master/eform-client/src/assets/i18n/en-US.json) and follow pattern on [ISO 639-1 standard language codes](https://www.andiamo.co.uk/resources/iso-language-codes/)

## Get access token

You need to create an account for Microting API and get your access credentials.

* Call Microting at +45 66 11 10 66 to get started.

## Sentry Configuration

Sentry error tracking is enabled by default in production environments but disabled in development mode to prevent unnecessary test data collection.

### Development Mode
When running locally with `yarn start`, Sentry is automatically disabled via the `environment.ts` configuration file where `enableSentry: false`.

### Production Mode
In production builds, Sentry is enabled through `environment.prod.ts` where `enableSentry: true`.

### Docker Configuration
When building Docker images, you can control Sentry behavior using the `DISABLE_SENTRY` build argument:

```bash
# Disable Sentry for testing/CI environments
docker build --build-arg DISABLE_SENTRY=true -t my-image .

# Enable Sentry for production (default behavior)
docker build -t my-image .
```

The `DISABLE_SENTRY` environment variable can be set to `true` or `1` to disable Sentry in both the Angular frontend and C# backend.

## Testing

### E2E Test Migration
We are actively migrating our end-to-end tests from WebDriverIO to Cypress for improved reliability and developer experience.

**📋 Migration Documentation:**
- [WDIO to Cypress Migration Plan](WDIO_TO_CYPRESS_MIGRATION.md) - Complete migration guide with all test details
- [Migration Summary](MIGRATION_SUMMARY.md) - Quick overview and status
- [Sub-Issue Templates](migration-issues/README.md) - Detailed specifications for each migration task

**Status:** 28 tests remaining to migrate (0% complete)

For more information on testing, see [Testing Documentation](eform-client/TESTING.md).

## Contributing

1. Do a fork
2. Clone your fork onto your own computer
3. Checkout/create a new branch for your relevant issue
4. Apply your changes and tests
5. Commit your changes and push to github
6. Create a pull-request

### Pull requests

To enable us to quickly review and accept your pull requests, always create one pull request per issue and link the issue in the pull request. Never merge multiple requests in one unless they have the same root cause. Be sure to follow our coding guidelines and keep code changes as small as possible. Avoid pure formatting changes to code that has not been modified otherwise. Pull requests should contain tests whenever possible.

Pull-reuqsts that do not pass tests, will not be accepted.

### Where to contribute

Check out the [full issues list](https://github.com/microting/eform-angular-frontend/issues) for a list of all potential areas for contributions.

To improve the chances to get a pull request merged you should select an issue that is labelled with the [help\_wanted](https://github.com/microting/eform-angular-frontend/issues?q=is%3Aissue+is%3Aopen+label%3Ahelp_wanted) or [bug](https://github.com/microting/eform-angular-frontend/issues?q=is%3Aissue+is%3Aopen+label%3Abug) labels. If the issue you want to work on is not labelled with `help-wanted` or `bug`, you can start a conversation with the issue owner asking whether an external contribution will be considered.

### Suggestions

We're also interested in your feedback for the future of Microting eForm SDK. You can submit a suggestion or feature request through the issue tracker. To make this process more effective, we're asking that these include more information to help define them more clearly.

## Microting Open Source Code of Conduct

This project has adopted the [Microting Open Source Code of Conduct](https://www.microting.com/microting-open-source-code-of-conduct). Contact opencode@microting.com with any additional questions or comments.

## License

The MIT License \(MIT\)

Copyright \(c\) 2007-2025 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files \(the "Software"\), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
