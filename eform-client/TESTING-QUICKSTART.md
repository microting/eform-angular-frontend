# Karma Unit Testing - Quick Start Guide

This guide will help you quickly get started with unit testing in the eForm Angular Frontend project.

## Quick Commands

```bash
# Run all tests
cd eform-client
ng test

# Run unit tests (Karma) - CI/CD friendly
npm run test:unit

# Run tests in headless mode (for CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Run tests with code coverage
ng test --code-coverage --watch=false --browsers=ChromeHeadless

# Generate a new spec file template
./generate-spec.sh src/app/modules/path/to/component.component.ts
```

## Files to Reference

### Documentation
- **[TESTING.md](./TESTING.md)** - Complete testing guide with patterns and examples
- **[TESTING-SUMMARY.md](./TESTING-SUMMARY.md)** - Implementation summary and status

### Example Spec Files

**Simple Components (good starting point)**:
- `src/app/modules/advanced/components/workers/worker-delete/worker-delete.component.spec.ts`
- `src/app/modules/advanced/components/folders/folder-delete/folder-delete.component.spec.ts`
- `src/app/modules/advanced/components/units/units-otp-code/units-otp-code.component.spec.ts`

**Complex Components (with dialogs and multiple methods)**:
- `src/app/modules/advanced/components/units/units.component.spec.ts`
- `src/app/modules/advanced/components/workers/workers/workers.component.spec.ts`
- `src/app/modules/advanced/components/folders/folders/folders.component.spec.ts`

**Form Components (create/edit)**:
- `src/app/modules/advanced/components/units/unit-create/unit-create.component.spec.ts`
- `src/app/modules/advanced/components/workers/worker-edit-create/worker-edit-create.component.spec.ts`

## Basic Test Structure

```typescript
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { YourComponent } from './your.component';
import { YourService } from 'src/app/common/services';
import { of } from 'rxjs';

describe('YourComponent', () => {
  let component: YourComponent;
  let fixture: ComponentFixture<YourComponent>;
  let mockService: jasmine.SpyObj<YourService>;

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('YourService', ['getData']);
    
    TestBed.configureTestingModule({
      declarations: [YourComponent],
      providers: [
        { provide: YourService, useValue: mockService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getData', () => {
    it('should load data successfully', () => {
      const mockData = { success: true, message: '', model: [] };
      mockService.getData.and.returnValue(of(mockData));

      component.getData();

      expect(mockService.getData).toHaveBeenCalled();
      expect(component.data).toEqual(mockData.model);
    });
  });
});
```

## Common Mocking Patterns

### Service
```typescript
mockService = jasmine.createSpyObj('ServiceName', ['method']);
mockService.method.and.returnValue(of({ success: true, message: '', model: [] }));
```

### Dialog
```typescript
mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
mockDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);
```

### Store
```typescript
mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
mockStore.select.and.returnValue(of(true));
```

### TranslateService
```typescript
mockTranslate = jasmine.createSpyObj('TranslateService', ['stream']);
mockTranslate.stream.and.returnValue(of('Translation'));
```

## Testing Checklist

For each component, ensure:
- [ ] Component creation test exists
- [ ] All public methods have tests
- [ ] Success scenarios are tested
- [ ] Failure scenarios are tested
- [ ] Edge cases are tested (null, empty, etc.)
- [ ] Service method calls are verified
- [ ] Component state changes are verified
- [ ] Dialog interactions are tested (if applicable)

## Status

**Completed**: 8 spec files covering units, workers, and folders components
**Remaining**: ~90 components across various modules
**Infrastructure**: ✅ Complete and ready to use

## Need Help?

1. Read [TESTING.md](./TESTING.md) for detailed patterns
2. Look at example spec files listed above
3. Use `generate-spec.sh` to create templates
4. Follow the established patterns

## CI/CD

Tests can be run in CI/CD pipelines with:
```bash
ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

Karma is configured with appropriate timeouts for CI/CD environments.
