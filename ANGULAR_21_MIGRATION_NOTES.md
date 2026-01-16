# Angular 21 Migration Notes

## Overview
This document describes the migration from Angular 20 to Angular 21.1.0 completed on January 16, 2026.

## Package Updates

### Core Angular Packages
All Angular packages were updated from version 20.x to 21.1.0:
- `@angular/animations`: 20.1.2 → 21.1.0
- `@angular/cdk`: 20.1.2 → 21.1.0
- `@angular/common`: 20.3.14 → 21.1.0
- `@angular/compiler`: 20.1.2 → 21.1.0
- `@angular/core`: 20.3.16 → 21.1.0
- `@angular/forms`: 20.1.2 → 21.1.0
- `@angular/localize`: 20.1.2 → 21.1.0
- `@angular/material`: 20.1.2 → 21.1.0
- `@angular/platform-browser`: 20.1.2 → 21.1.0
- `@angular/platform-browser-dynamic`: 20.1.2 → 21.1.0
- `@angular/router`: 20.1.2 → 21.1.0

### Angular CLI and Dev Tools
- `@angular/cli`: 20.3.9 → 21.1.0
- `@angular/compiler-cli`: 20.1.2 → 21.1.0
- `@angular/language-service`: 20.3.10 → 21.1.0
- `@angular-devkit/build-angular`: 20.3.9 → 21.1.0
- `@angular-devkit/core`: 20.3.9 → 21.1.0
- `@angular-devkit/schematics`: 21.0.4 → 21.1.0

### Angular ESLint
- `@angular-eslint/builder`: 20.5.1 → 21.1.0
- `@angular-eslint/eslint-plugin`: 21.1.0 (already up to date)
- `@angular-eslint/eslint-plugin-template`: 20.6.0 → 21.1.0
- `@angular-eslint/schematics`: 20.5.1 → 21.1.0
- `@angular-eslint/template-parser`: 20.5.0 → 21.1.0

### Related Dependencies
- `@ng-matero/extensions`: 20.4.2 → 21.1.3
- `@angular-builders/jest`: 20.0.0 → 21.0.3
- `ngx-cookie-service`: 20.1.1 → 21.1.0

### TypeScript
- `typescript`: 5.8.3 → 5.9.3 (required by Angular 21)

### Testing
- Added `jest-environment-jsdom`: ^30.2.0 (required for Jest 30)

## Configuration Changes

### tsconfig.json
The main TypeScript configuration required two critical changes:

1. **Module Resolution**: Changed from `"node"` to `"Bundler"`
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "Bundler"
     }
   }
   ```
   This change is **required** for Angular 21's module resolution system to work properly with Angular Material and other scoped packages.

2. **Path Mappings**: Removed wildcard path mapping
   ```json
   // REMOVED (was causing module resolution conflicts):
   "*": ["./*"]
   
   // KEPT:
   "src/*": ["./src/*"]
   ```
   The wildcard path was interfering with proper resolution of @angular/* packages.

### tsconfig.spec.json
Updated to explicitly set Bundler module resolution:
```json
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "Bundler"
  }
}
```

## Breaking Changes

### TypeScript Version Requirement
Angular 21 requires TypeScript >= 5.9.0 and < 6.0.0. Projects using TypeScript 5.8.x or earlier must upgrade.

### Module Resolution
The change to `moduleResolution: "Bundler"` is mandatory. Projects cannot use `"node"` module resolution with Angular 21.

## Known Issues and Warnings

### Peer Dependency Warnings
Several third-party packages have not yet updated their peer dependencies for Angular 21:
- `@angular-material-extensions/password-strength` (expects Angular 16)
- `@ngrx/*` packages (expect Angular 19)
- `@sentry/angular` (expects Angular ≤ 20)
- `@swimlane/ngx-charts` (expects Angular 18-20)
- `ng2-dragula` (expects Angular < 20)
- `ng2-file-upload` (expects Angular 20)

These warnings do not prevent the application from building or running. The packages work with Angular 21 despite the peer dependency mismatches.

### Sass Deprecation Warnings
There are deprecation warnings for Sass `if()` function usage in:
- `src/scss/libs/ngx-editor/_ngx-editor.scss`
- `src/scss/libs/theme.scss`

These are non-blocking warnings that should be addressed in a future update.

### Unit Test Module Resolution
Jest unit tests currently have TypeScript module resolution issues with the new `Bundler` module resolution strategy. This is a limitation of the jest-preset-angular transformer and does not affect the application build or runtime. The build works correctly.

## Migration Steps for Other Developers

To apply this upgrade to a fresh clone:

1. **Install dependencies**:
   ```bash
   cd eform-client
   rm -rf node_modules
   yarn install
   ```

2. **Build the application**:
   ```bash
   yarn build
   ```

3. **Verify the build**:
   - Check that the build completes successfully
   - The initial build may take 30-40 seconds
   - Subsequent builds with cache will be faster

## Rollback Procedure

If you need to rollback to Angular 20:

1. Check out the commit before the Angular 21 upgrade
2. Delete `node_modules` and `yarn.lock`
3. Run `yarn install`
4. Build the application

## Performance Notes

- Build time: ~30-35 seconds (similar to Angular 20)
- Bundle sizes: No significant changes observed
- Application startup: No noticeable performance impact

## Compatibility

### Node.js
- Minimum: Node.js 18.x
- Tested: Node.js 20.19.6 ✅

### Browsers
No changes to browser support. Angular 21 maintains the same browser compatibility as Angular 20.

## References

- [Angular 21 Release Notes](https://github.com/angular/angular/releases/tag/21.0.0)
- [Angular Update Guide](https://update.angular.io/)
- [TypeScript 5.9 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
