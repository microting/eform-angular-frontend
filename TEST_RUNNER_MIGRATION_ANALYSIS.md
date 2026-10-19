# Test Runner Migration Analysis for Angular 21

## Executive Summary

**Current Problem**: Jest with jest-preset-angular v16.0.0 doesn't support Angular 21's `Bundler` module resolution, causing 29/31 test suites to fail.

**Recommended Solution**: **Migrate to Vitest** - Modern, fast, ESM-native test runner with excellent Angular 21 support.

**Migration Effort**: Medium (2-3 days)
**Test Coverage**: Can be fully retained (100%)
**CI/CD Impact**: Minimal changes needed

---

## Test Runner Comparison

### 1. Vitest ⭐ **RECOMMENDED**

**Pros:**
- ✅ **Native ESM support** - Handles Angular 21's Bundler module resolution perfectly
- ✅ **Vite-powered** - Uses same build tool Angular CLI is moving toward
- ✅ **Jest-compatible API** - Minimal test code changes (expect, describe, it, beforeEach)
- ✅ **Fast execution** - 2-10x faster than Jest (parallel by default)
- ✅ **Modern tooling** - Active development, Angular community adoption growing
- ✅ **Good Angular support** - Community plugin available (`@analogjs/vite-plugin-angular`)
- ✅ **Coverage reporting** - Built-in via `@vitest/coverage-v8` or `@vitest/coverage-istanbul`
- ✅ **Watch mode** - Excellent DX with instant feedback

**Cons:**
- ⚠️ Newer tool (less mature than Jest, but production-ready)
- ⚠️ Requires Vite configuration alongside Angular CLI
- ⚠️ Some Jest-specific features may need alternatives

**Migration Effort**: Medium
- Install dependencies: 15 min
- Configure Vitest: 1-2 hours
- Fix test imports/syntax: 2-4 hours (mostly automated)
- Update CI/CD: 30 min
- Verify coverage: 1 hour

**Community Support**: Growing rapidly in Angular ecosystem

---

### 2. Web Test Runner (Modern Web)

**Pros:**
- ✅ Runs tests in real browsers (Chrome, Firefox, Safari)
- ✅ No build step needed for modern browsers
- ✅ Good ESM support
- ✅ Plugin ecosystem

**Cons:**
- ❌ Different API from Jest (more boilerplate)
- ❌ Slower than Vitest (real browser overhead)
- ❌ Less Angular-specific tooling
- ❌ More complex setup for Angular

**Migration Effort**: High (4-6 days)

---

### 3. Karma + Jasmine (Angular's Traditional Stack)

**Pros:**
- ✅ Official Angular support (historically)
- ✅ Well-documented for Angular

**Cons:**
- ❌ **Being phased out** - Angular team moving away from Karma
- ❌ Slower execution
- ❌ More complex configuration
- ❌ Not recommended for new projects

**Migration Effort**: High (4-5 days)
**Verdict**: ❌ **NOT RECOMMENDED** - Deprecated path

---

### 4. Staying with Jest + Workarounds

**Pros:**
- ✅ No migration needed
- ✅ Familiar tooling

**Cons:**
- ❌ Doesn't solve the core problem
- ❌ Requires maintaining custom resolver/workarounds
- ❌ May break with future Angular updates
- ❌ Limited long-term viability

**Verdict**: ❌ **NOT RECOMMENDED** - Technical debt

---

## Recommended Migration Plan: Jest → Vitest

### Phase 1: Setup & Configuration (2-4 hours)

#### 1.1 Install Dependencies

```json
// package.json additions
{
  "devDependencies": {
    "vitest": "^2.1.0",
    "@vitest/ui": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "@analogjs/vite-plugin-angular": "^1.9.0",
    "vite": "^5.4.0",
    "happy-dom": "^15.11.0"
  }
}
```

**Remove:**
- `jest` (keep as dev dep initially for comparison)
- `jest-preset-angular`
- `@types/jest` (optional, Vitest has built-in types)

#### 1.2 Create Vitest Configuration

**File:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    setupFiles: ['src/setup-vitest.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      'e2e',
      'cypress',
      'tests-examples'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'text-summary', 'lcov'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.module.ts',
        'src/**/*.interface.ts',
        'src/**/*.model.ts'
      ],
      include: ['src/app/**/*.ts']
    }
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      'ng-gallery': path.resolve(__dirname, './src/__mocks__/ng-gallery.ts'),
      'ng-gallery/lightbox': path.resolve(__dirname, './src/__mocks__/ng-gallery/lightbox.ts')
    }
  }
});
```

#### 1.3 Create Vitest Setup File

**File:** `src/setup-vitest.ts`

```typescript
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Browser mocks
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance']
  })
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true
  })
});
```

### Phase 2: Update Test Files (2-4 hours)

**Changes needed in test files:**

#### 2.1 Import Changes (Automated via script)

```typescript
// BEFORE (Jest)
import { TestBed } from '@angular/core/testing';

// AFTER (Vitest) - No change needed! Vitest uses same imports
import { TestBed } from '@angular/core/testing';
```

**Good news**: Most test syntax is identical! `describe`, `it`, `expect`, `beforeEach` all work the same.

#### 2.2 Mock Changes

```typescript
// BEFORE (Jest)
jest.fn()
jest.spyOn()

// AFTER (Vitest)
vi.fn()
vi.spyOn()
```

**Migration Script:** Create `migrate-tests.sh`:

```bash
#!/bin/bash
find src -name "*.spec.ts" -type f -exec sed -i \
  -e 's/jest\.fn/vi.fn/g' \
  -e 's/jest\.spyOn/vi.spyOn/g' \
  -e 's/jest\.mock/vi.mock/g' \
  {} \;
```

### Phase 3: Update Package Scripts (15 min)

```json
{
  "scripts": {
    "test:unit": "vitest run --coverage",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage --reporter=junit --reporter=default"
  }
}
```

### Phase 4: Update CI/CD (30 min)

**File:** `.github/workflows/dotnet-core-pr.yml`

```yaml
- name: Run Jest unit tests
  run: cd eform-client && npm run test:unit
```

Change to:

```yaml
- name: Run Vitest unit tests
  run: cd eform-client && npm run test:unit
```

**No other changes needed!** Vitest generates same coverage formats (lcov, html, etc.)

### Phase 5: Validation (1-2 hours)

1. Run all tests: `npm run test:unit`
2. Verify coverage matches previous baseline
3. Check CI pipeline execution
4. Test watch mode: `npm run test:watch`
5. Compare execution speed

---

## Migration Checklist

### Pre-Migration
- [ ] Document current test coverage baseline
- [ ] Backup current jest.config.js
- [ ] Create migration branch
- [ ] Review all test files for Jest-specific features

### Migration
- [ ] Install Vitest dependencies
- [ ] Create vitest.config.ts
- [ ] Create setup-vitest.ts
- [ ] Run migration script for mock functions
- [ ] Update package.json scripts
- [ ] Update CI/CD workflows
- [ ] Remove jest-specific files (keep as backup initially)

### Validation
- [ ] All tests pass locally
- [ ] Coverage reports generated correctly
- [ ] CI pipeline succeeds
- [ ] Watch mode works
- [ ] Coverage percentage matches/exceeds baseline

### Cleanup
- [ ] Remove Jest dependencies
- [ ] Delete jest.config.js
- [ ] Delete tsconfig.jest.json (Vitest uses main tsconfig)
- [ ] Delete jest-resolver.js
- [ ] Update documentation

---

## Test Coverage Retention

**Current Coverage Targets:**
```javascript
collectCoverageFrom: [
  'src/app/**/*.ts',
  '!src/app/**/*.spec.ts',
  '!src/app/**/*.module.ts',
  '!src/app/**/*.interface.ts',
  '!src/app/**/*.model.ts'
]
```

**Vitest Equivalent:**
```typescript
coverage: {
  include: ['src/app/**/*.ts'],
  exclude: [
    'src/**/*.spec.ts',
    'src/**/*.module.ts',
    'src/**/*.interface.ts',
    'src/**/*.model.ts'
  ]
}
```

✅ **Coverage will be preserved** - Same files tested, same exclusions

---

## Expected Improvements

### Performance
- **Current (Jest)**: ~70 seconds for 31 test suites
- **Expected (Vitest)**: ~15-30 seconds (2-4x faster)

### Developer Experience
- ✅ Instant feedback in watch mode
- ✅ Better error messages
- ✅ Built-in UI for debugging tests
- ✅ No module resolution issues

### Maintainability
- ✅ Less configuration needed
- ✅ No custom resolvers/workarounds
- ✅ Better Angular 21+ support going forward
- ✅ Active community development

---

## Risks & Mitigation

### Risk 1: Unforeseen Test Failures
**Mitigation:** Run migration in parallel branch, compare results before switching

### Risk 2: CI/CD Issues
**Mitigation:** Test CI pipeline thoroughly before merging

### Risk 3: Team Learning Curve
**Mitigation:** Vitest API is 95% compatible with Jest - minimal retraining

### Risk 4: Third-party Mock Libraries
**Mitigation:** Most Jest ecosystem tools work with Vitest (e.g., testing-library)

---

## Cost-Benefit Analysis

### Costs
- **Time**: 2-3 days for complete migration
- **Risk**: Low (can rollback easily)
- **Learning**: Minimal (Jest-compatible API)

### Benefits
- **Solves Angular 21 issue**: ✅ No more module resolution errors
- **Performance**: 2-4x faster test execution
- **Future-proof**: Better long-term Angular support
- **Developer Experience**: Better tooling and feedback
- **Maintenance**: Less configuration, fewer workarounds

**ROI**: High - One-time migration cost for ongoing benefits

---

## Alternative: Staying with Jest (Not Recommended)

If migration is not feasible, the Jest approach requires:

### Option A: Custom Module Resolver (Complex)
- Maintain complex jest-resolver.js
- Risk of breaking with updates
- Ongoing maintenance burden

### Option B: Wait for jest-preset-angular Update
- Timeline unknown (may take months)
- No guarantee of fix
- Blocks Angular 21 adoption

### Option C: Downgrade to Angular 20
- Not a forward solution
- Misses Angular 21 features
- Technical debt

**Verdict:** All alternatives are inferior to migrating to Vitest

---

## Recommendation

**Migrate to Vitest** - It's the cleanest, most maintainable solution that:
1. ✅ Solves the immediate Angular 21 issue
2. ✅ Improves test performance significantly  
3. ✅ Provides better developer experience
4. ✅ Future-proofs the testing infrastructure
5. ✅ Requires minimal test code changes
6. ✅ Retains 100% test coverage

**Timeline:** 2-3 days
**Risk Level:** Low
**Expected Value:** High

---

## Next Steps

1. **Approval**: Get stakeholder buy-in for migration
2. **Branch**: Create `feature/vitest-migration` branch
3. **Execute**: Follow migration plan above
4. **Validate**: Run full test suite and verify coverage
5. **Deploy**: Update CI/CD and merge to main
6. **Monitor**: Track test execution time and failures

---

## References

- [Vitest Official Documentation](https://vitest.dev/)
- [Analog (Angular + Vite) Documentation](https://analogjs.org/)
- [Vitest Angular Examples](https://github.com/analogjs/analog/tree/main/packages/vite-plugin-angular)
- [Jest to Vitest Migration Guide](https://vitest.dev/guide/migration.html)

---

## Appendix: Sample Test Comparison

### Before (Jest)
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyComponent]
    });
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method', () => {
    const spy = jest.spyOn(component, 'myMethod');
    component.myMethod();
    expect(spy).toHaveBeenCalled();
  });
});
```

### After (Vitest) - Nearly Identical!
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyComponent]
    });
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method', () => {
    const spy = vi.spyOn(component, 'myMethod'); // Only change!
    component.myMethod();
    expect(spy).toHaveBeenCalled();
  });
});
```

**Difference:** Only `jest.spyOn` → `vi.spyOn` and similar mock function changes.

---

**End of Analysis**
