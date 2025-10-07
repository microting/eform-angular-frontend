# Karma Unit Testing Guide for eForm Angular Frontend

## Overview

This document describes the unit testing approach and patterns used for testing Angular components and services in the eform-client/src/app/modules directory.

## Test Infrastructure

### Tools & Frameworks
- **Jasmine**: Behavior-driven testing framework
- **Karma**: Test runner for executing tests in browsers
- **Angular Testing Utilities**: `TestBed`, `ComponentFixture`, etc.

### Configuration Files
- `src/karma.conf.js`: Karma configuration with increased timeouts for CI/CD
- `src/test.ts`: Test entry point with zone.js and Jasmine setup
- `src/tsconfig.spec.json`: TypeScript configuration for tests

### Running Tests

```bash
# Run all tests
ng test

# Run unit tests (CI/CD friendly)
npm run test:unit

# Run tests in headless mode (for CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Run with code coverage
ng test --code-coverage
```

## Testing Patterns and Best Practices

### 1. Component Testing Structure

Every component test file should follow this structure:

```typescript
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComponentName } from './component-name.component';
// Import dependencies...

describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for dependencies
    mockService = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

    TestBed.configureTestingModule({
      declarations: [ComponentName],
      providers: [
        { provide: ServiceName, useValue: mockService },
        // ... other providers
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Additional tests...
});
```

### 2. Mocking Services

Always mock external dependencies using Jasmine spies:

```typescript
// Create a spy object
mockService = jasmine.createSpyObj('ServiceName', ['getAllItems', 'createItem']);

// Configure return values
mockService.getAllItems.and.returnValue(of({ 
  success: true, 
  message: '', 
  model: [] 
}));

// Verify method calls
expect(mockService.getAllItems).toHaveBeenCalled();
expect(mockService.createItem).toHaveBeenCalledWith(expectedData);
```

### 3. Mocking Angular Material Dialog

```typescript
let mockDialog: jasmine.SpyObj<MatDialog>;

beforeEach(() => {
  mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
});

// In tests
const mockDialogRef = {
  afterClosed: () => of(true) // or of(false) for cancellation
};
mockDialog.open.and.returnValue(mockDialogRef as any);
```

### 4. Mocking NgRx Store

```typescript
let mockStore: jasmine.SpyObj<Store>;

beforeEach(() => {
  mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  mockStore.select.and.returnValue(of(true)); // or appropriate selector value
});
```

### 5. Mocking TranslateService

```typescript
let mockTranslateService: jasmine.SpyObj<TranslateService>;

beforeEach(() => {
  mockTranslateService = jasmine.createSpyObj('TranslateService', ['stream', 'instant']);
  mockTranslateService.stream.and.returnValue(of('Translated Text'));
});
```

### 6. Testing Observable-Based Methods

```typescript
describe('loadAllItems', () => {
  it('should load items successfully', () => {
    const mockItems: ItemDto[] = [
      { id: 1, name: 'Item 1' } as ItemDto,
      { id: 2, name: 'Item 2' } as ItemDto
    ];
    const mockResult: OperationDataResult<Array<ItemDto>> = {
      success: true,
      message: '',
      model: mockItems
    };
    mockService.getAllItems.and.returnValue(of(mockResult));

    component.loadAllItems();

    expect(mockService.getAllItems).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
  });

  it('should handle unsuccessful response', () => {
    const mockResult: OperationDataResult<Array<ItemDto>> = {
      success: false,
      message: 'Error message',
      model: null
    };
    mockService.getAllItems.and.returnValue(of(mockResult));

    component.loadAllItems();

    expect(mockService.getAllItems).toHaveBeenCalled();
    expect(component.items).toEqual([]);
  });
});
```

### 7. Testing Dialog Interactions

```typescript
describe('openCreateModal', () => {
  it('should open modal and reload data on success', () => {
    const mockDialogRef = {
      afterClosed: () => of(true)
    };
    mockDialog.open.and.returnValue(mockDialogRef as any);
    
    spyOn(component, 'loadAllItems');
    component.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.loadAllItems).toHaveBeenCalled();
  });

  it('should not reload data when modal is cancelled', () => {
    const mockDialogRef = {
      afterClosed: () => of(false)
    };
    mockDialog.open.and.returnValue(mockDialogRef as any);

    spyOn(component, 'loadAllItems');
    component.openCreateModal();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.loadAllItems).not.toHaveBeenCalled();
  });
});
```

### 8. Testing MatDialogRef Close

For components that use MatDialogRef:

```typescript
let mockDialogRef: jasmine.SpyObj<MatDialogRef<ComponentName>>;

beforeEach(() => {
  mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
});

it('should close dialog with true when successful', () => {
  component.hide(true);
  expect(mockDialogRef.close).toHaveBeenCalledWith(true);
});

it('should close dialog with false by default', () => {
  component.hide();
  expect(mockDialogRef.close).toHaveBeenCalledWith(false);
});
```

### 9. Testing MAT_DIALOG_DATA Injection

```typescript
let mockDialogData: DataModel;

beforeEach(() => {
  mockDialogData = { id: 1, name: 'Test' } as DataModel;

  TestBed.configureTestingModule({
    declarations: [ComponentName],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      // ... other providers
    ]
  });
});

it('should initialize with dialog data', () => {
  expect(component.data).toBeDefined();
  expect(component.data.id).toBe(1);
});
```

## Common Data Models

### OperationResult and OperationDataResult

All API responses use these models, which must include the `message` property:

```typescript
// OperationResult
const mockResult: OperationResult = {
  success: true,
  message: ''
};

// OperationDataResult
const mockResult: OperationDataResult<T> = {
  success: true,
  message: '',
  model: data
};
```

## Example Test Files

Reference implementations can be found in:
- `src/app/modules/advanced/components/units/units.component.spec.ts`
- `src/app/modules/advanced/components/units/unit-create/unit-create.component.spec.ts`
- `src/app/modules/advanced/components/units/units-otp-code/units-otp-code.component.spec.ts`
- `src/app/modules/advanced/components/workers/workers/workers.component.spec.ts`
- `src/app/modules/advanced/components/workers/worker-edit-create/worker-edit-create.component.spec.ts`
- `src/app/modules/advanced/components/folders/folders/folders.component.spec.ts`

## Coverage Goals

- **Methods**: All public methods should have test coverage
- **Scenarios**: Test both success and failure cases
- **Edge Cases**: Test null/undefined values, empty arrays, etc.
- **Interactions**: Test component interactions with services and dialogs

## Test Naming Conventions

- Use descriptive test names: `'should load items successfully'`
- Group related tests using `describe` blocks
- Start with `'should'` for behavior descriptions
- Be specific about what is being tested

## Troubleshooting

### Common Issues

1. **Missing message property**: Ensure all OperationResult/OperationDataResult objects include `message: ''`
2. **Zone.js imports**: Use `import 'zone.js'` and `import 'zone.js/testing'` in test.ts
3. **Karma timeouts**: Increase `browserNoActivityTimeout` in karma.conf.js for slow tests
4. **Spy not configured**: Always configure spy return values with `.and.returnValue()`

### Debugging Tests

```bash
# Run tests with source maps for debugging
ng test --source-map

# Run a single test file (may not work with all configurations)
ng test --include='**/component-name.component.spec.ts'

# Increase Karma logging
# Edit karma.conf.js and set logLevel: config.LOG_DEBUG
```

## Continuous Integration

Tests are designed to run in CI/CD pipelines:

```bash
# Headless mode for CI/CD
ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

## Contributing

When adding new components:
1. Create a `.spec.ts` file alongside the component
2. Follow the patterns documented here
3. Ensure all public methods are tested
4. Test both success and error scenarios
5. Run tests locally before committing

## Additional Resources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
