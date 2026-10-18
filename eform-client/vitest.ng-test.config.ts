import { defineConfig } from 'vitest/config';

// Extra Vitest options for `ng test` (angular.json `test.options.runnerConfig`).
// The Angular builder defaults to `isolate: false`, which shares the module cache between
// spec files in a worker; `vi.mock` of a package an earlier spec already loaded then has no
// effect. Isolating each spec file keeps module mocks (e.g. '@sentry/angular') reliable.
export default defineConfig({
  test: {
    isolate: true,
  },
});
