# Angular 21 Plugin Migration Guide

This guide documents all changes made when migrating `eform-angular-frontend` from Angular 20 (stable branch) to Angular 21 (angular19 branch). Use it as a reference when migrating plugins.

## 1. Package Version Changes

### Angular Packages (all → 21.1.0)

| Package | Stable | Angular 21 |
|---------|--------|------------|
| @angular/core | 20.3.17 | 21.1.0 |
| @angular/common | 20.3.16 | 21.1.0 |
| @angular/forms | 20.3.16 | 21.1.0 |
| @angular/router | 20.3.16 | 21.1.0 |
| @angular/compiler | 20.3.16 | 21.1.0 |
| @angular/animations | 20.3.16 | 21.1.0 |
| @angular/cdk | 20.2.14 | 21.1.0 |
| @angular/material | 20.2.14 | 21.1.0 |
| @angular/platform-browser | 20.3.16 | 21.1.0 |
| @angular/platform-browser-dynamic | 20.3.16 | 21.1.0 |
| @angular/cli | 20.3.15 | 21.1.0 |
| @angular/compiler-cli | 20.3.16 | 21.1.0 |
| @angular-devkit/build-angular | 20.3.9 | 21.1.0 |

### Other Key Packages

| Package | Stable | Angular 21 | Notes |
|---------|--------|------------|-------|
| @ng-matero/extensions | 20.4.2 | 21.1.3 | |
| @ngrx/store, effects, entity | 20.1.0 | 19.2.1 | **Downgraded** for compatibility |
| @ngrx/store-devtools | 20.1.0 | 19.2.1 | **Downgraded** |
| ngx-cookie-service | 20.1.1 | 21.1.0 | |
| typescript | 5.8.3 | 5.9.3 | |
| yarn | 1.22.19 | 4.13.0 | **Major upgrade** |

### New Packages Added

- `vitest` ^4.0.0 (replaces Jest)
- `@analogjs/vite-plugin-angular` ^2.2.2
- `@analogjs/vitest-angular` ^2.2.2
- `@vitest/coverage-v8` ^4.0.0
- `@vitest/ui` ^4.0.0
- `vite` ^7.3.1
- `happy-dom` ^15.11.7 (test environment)
- `@angular/build` 21.1.0 (new builder)

### Removed Packages

- `@angular-builders/jest` (replaced by @angular/build)
- `@types/jest` (Vitest has its own types)

---

## 2. Component Migration: Standalone Conversion

Every component must be converted from `standalone: false` to a standalone component with explicit `imports`.

### Before (stable)

```typescript
@Component({
    selector: 'app-my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    standalone: false
})
export class MyComponent { }
```

### After (angular21)

```typescript
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
// ... import every dependency used in the template

@Component({
    selector: 'app-my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        NgIf, NgFor, AsyncPipe,
        ReactiveFormsModule, FormsModule,
        MatFormField, MatLabel, MatInput,
        MatButton, MatIconButton, MatIcon,
        TranslatePipe,
        // ... all template dependencies
    ]
})
export class MyComponent { }
```

### What to add to `imports`

You must import **every** directive, pipe, component, and module used in the template:

| Template Usage | Import |
|---------------|--------|
| `*ngIf` | `NgIf` from `@angular/common` |
| `*ngFor` | `NgFor` from `@angular/common` |
| `\| async` | `AsyncPipe` from `@angular/common` |
| `\| translate` | `TranslatePipe` from `@ngx-translate/core` |
| `[(ngModel)]` | `FormsModule` from `@angular/forms` |
| `[formGroup]` | `ReactiveFormsModule` from `@angular/forms` |
| `<mat-form-field>` | `MatFormField` from `@angular/material/form-field` |
| `<mat-label>` | `MatLabel` from `@angular/material/form-field` |
| `<input matInput>` | `MatInput` from `@angular/material/input` |
| `<mat-icon>` | `MatIcon` from `@angular/material/icon` |
| `<button mat-button>` | `MatButton` from `@angular/material/button` |
| `<button mat-icon-button>` | `MatIconButton` from `@angular/material/button` |
| `<mat-card>` | `MatCard` from `@angular/material/card` |
| `<mat-card-content>` | `MatCardContent` from `@angular/material/card` |
| `<mat-checkbox>` | `MatCheckbox` from `@angular/material/checkbox` |
| `<mat-menu>` | `MatMenu` from `@angular/material/menu` |
| `[matMenuTriggerFor]` | `MatMenuTrigger` from `@angular/material/menu` |
| `<button mat-menu-item>` | `MatMenuItem` from `@angular/material/menu` |
| `<mat-tooltip>` | `MatTooltip` from `@angular/material/tooltip` |
| `<mat-slide-toggle>` | `MatSlideToggle` from `@angular/material/slide-toggle` |
| `mat-dialog-title` | `MatDialogTitle` from `@angular/material/dialog` |
| `mat-dialog-content` | `MatDialogContent` from `@angular/material/dialog` |
| `mat-dialog-actions` | `MatDialogActions` from `@angular/material/dialog` |
| `<mtx-grid>` | `MtxGrid` from `@ng-matero/extensions/grid` |
| `<mtx-select>` | `MtxSelect` from `@ng-matero/extensions/select` |
| `<ng-select>` | `NgSelectComponent` from `@ng-select/ng-select` |
| `cdkScrollable` | `CdkScrollable` from `@angular/cdk/scrolling` |
| `[routerLink]` | `RouterLink` from `@angular/router` |
| Custom `<app-*>` | Import the component class directly |
| Custom pipes | Import the pipe class directly |

### Dialog components example

```typescript
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-my-dialog',
    templateUrl: './my-dialog.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, TranslatePipe]
})
```

---

## 3. NgModule Changes

NgModules are **kept** but transformed. Components move from `declarations` to `imports`.

### Before

```typescript
@NgModule({
  imports: [CommonModule, TranslateModule, ...],
  declarations: [ComponentA, ComponentB, ComponentC],
  exports: [ComponentA, ComponentB, ComponentC]
})
export class MyPluginModule { }
```

### After

```typescript
@NgModule({
    imports: [
        CommonModule, TranslateModule, ...,
        ComponentA,   // moved from declarations
        ComponentB,
        ComponentC,
    ],
    // declarations array removed entirely
    exports: [ComponentA, ComponentB, ComponentC]
})
export class MyPluginModule { }
```

### Deleted shared modules

These wrapper modules were removed — replace their imports with direct component imports:
- `EformImportedModule` → import components directly
- `FormattingTextEditorModule` → import `FormattingTextEditorComponent` directly

---

## 4. Bootstrap Changes (main.ts)

The app bootstrap changed from NgModule to standalone:

### Before

```typescript
platformBrowserDynamic()
  .bootstrapModule(AppModule)
```

### After

```typescript
import { provideZoneChangeDetection } from '@angular/core';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        importProvidersFrom(...),
        // ... all providers
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: { usePopover: false },
        },
    ]
})
```

### Critical providers

These **must** be in the bootstrap providers or the app will break:

1. **`provideZoneChangeDetection({ eventCoalescing: true })`** — Without this, Angular doesn't trigger change detection after async operations (HTTP responses, timers). Tables won't refresh after API calls.

2. **`OVERLAY_DEFAULT_CONFIG` with `usePopover: false`** — Angular 21 CDK uses the native Popover API by default, which renders overlays in the browser's Top Layer. This breaks `ng-select`/`mtx-select` dropdowns with `appendTo="body"` inside dialogs because they render in normal DOM and can't appear above the Top Layer.

---

## 5. TypeScript Configuration

### tsconfig.json

```diff
- "moduleResolution": "node"
+ "moduleResolution": "Bundler"

  "paths": {
-   "*": ["./*"],
    "src/*": ["./src/*"]
  }
```

### tsconfig.spec.json

```diff
+ "module": "ES2022",
+ "moduleResolution": "Bundler",
  "types": [
-   "jest", "node", "jasmine"
+   "node"
  ],
  "files": [
    "polyfills.ts",
+   "test-setup.ts"
  ],
```

---

## 6. Build Configuration (angular.json)

### Builder changes

```diff
- "builder": "@angular-devkit/build-angular:application"
+ "builder": "@angular/build:application"

- "builder": "@angular-builders/jest:run"
+ "builder": "@angular/build:unit-test"
```

### Test configuration

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "src/tsconfig.spec.json",
    "include": ["src/**/*.spec.ts"]
  }
}
```

---

## 7. HTML Template Changes

### Dynamic IDs in repeated templates

All static IDs in `*ngFor` / `mtx-grid` row templates must be indexed:

```diff
- <div id="actionMenu">
+ <div id="actionMenu{{i}}">

- <div id="entitySearchName">
+ <div id="entitySearchName-{{i}}">

- <div id="deviceUserId">
+ <div id="deviceUserId-{{i}}">
```

Make sure the template has access to the index:

```diff
- <ng-template #myTpl let-row>
+ <ng-template #myTpl let-row let-i="index">
```

**Why:** Duplicate IDs break accessibility and Playwright/Cypress test selectors. Angular Material 21's MDC components are stricter about DOM structure.

---

## 8. Global SCSS Fixes

Add these to the global `styles.scss` to fix Material 21 / CDK 21 issues:

### Form field pointer events

```scss
// MDC form field subscript extends beyond visual bounds
.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align {
  pointer-events: none;
}
```

### Dialog action buttons

```scss
// Keep dialog buttons clickable above form fields
[mat-dialog-actions], .mat-mdc-dialog-actions {
  position: relative;
  z-index: 1;
}
```

### ng-select / mtx-select dropdown visibility

```scss
// Fix dropdowns hidden behind CDK overlay (z-index 1000)
ng-dropdown-panel, .ng-dropdown-panel {
  z-index: 1100 !important;
}

// Prevent .mdc-text-field will-change from creating stacking context
.mat-mdc-form-field.mat-focused {
  z-index: auto !important;
}
.mdc-text-field {
  will-change: auto !important;
}
```

### Expansion panel / tree node visibility

```scss
// CDK 21 applies visibility:hidden to collapsed content
.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content {
  visibility: visible !important;
}
.mat-expansion-panel.mat-expanded .mat-tree-node,
.mat-expansion-panel.mat-expanded .cdk-tree-node,
.mat-expansion-panel.mat-expanded mat-tree-node {
  visibility: visible !important;
}
```

### Backdrop opacity

```scss
// Material 21 default backdrop change
.cdk-overlay-backdrop {
  background-color: rgba(0, 0, 0, 0.32) !important;
}
```

---

## 9. Unit Test Migration: Jest → Vitest

### Configuration files

Delete:
- `jest.config.js`
- `jest-resolver.js`
- `tsconfig.jest.json`
- `src/setup-jest.ts`

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
  resolve: {
    alias: { 'src': resolve(__dirname, './src') },
  },
});
```

Create `src/test-setup.ts`:
```typescript
import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

Object.defineProperty(window, 'CSS', { value: null });
```

### Test code changes

| Jest | Vitest |
|------|--------|
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `waitForAsync(() => { })` | `async () => { }` |
| implicit globals | `import { describe, it, expect, beforeEach, vi } from 'vitest'` |

### TestBed changes

```diff
  TestBed.configureTestingModule({
-   declarations: [MyComponent],
+   imports: [FormsModule, MyComponent],  // standalone components go in imports
    providers: [...],
    schemas: [NO_ERRORS_SCHEMA]
  })
```

### npm scripts

```diff
- "test:ci": "jest --ci --coverage --maxWorkers=2"
- "test:unit": "jest --coverage"
- "test:local_unit": "jest --watch"
+ "test:local_unit": "vitest"
```

---

## 10. Migration Checklist

For each plugin:

- [ ] Update `package.json` — bump all @angular/* to 21.1.0, @ng-matero/extensions to 21.1.3
- [ ] Update `package.json` — downgrade @ngrx/* to 19.2.1
- [ ] Update `package.json` — replace jest with vitest dependencies
- [ ] Update `angular.json` — change builders to `@angular/build:*`
- [ ] Update `tsconfig.json` — set `moduleResolution: "Bundler"`
- [ ] Convert every component: remove `standalone: false`, add `imports: [...]`
- [ ] Update every NgModule: move components from `declarations` to `imports`
- [ ] Remove imports of deleted modules (`EformImportedModule`, etc.)
- [ ] Add `let-i="index"` to all mtx-grid row templates
- [ ] Convert all static IDs to indexed IDs in repeated templates
- [ ] Add SCSS fixes for Material 21 / CDK 21 issues
- [ ] Convert unit tests from Jest to Vitest
- [ ] Create `vitest.config.ts` and `src/test-setup.ts`
- [ ] Update `tsconfig.spec.json`
- [ ] Test all ng-select/mtx-select dropdowns inside dialogs
- [ ] Test all expansion panels with tree nodes
- [ ] Verify table refresh after create/edit/delete operations
