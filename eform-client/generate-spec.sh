#!/bin/bash

# Script to generate a basic spec file template for an Angular component
# Usage: ./generate-spec.sh path/to/component.ts

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-component.ts>"
  echo "Example: $0 src/app/modules/advanced/components/units/units.component.ts"
  exit 1
fi

COMPONENT_FILE="$1"

if [ ! -f "$COMPONENT_FILE" ]; then
  echo "Error: Component file '$COMPONENT_FILE' not found"
  exit 1
fi

# Check if spec file already exists
SPEC_FILE="${COMPONENT_FILE%.ts}.spec.ts"
if [ -f "$SPEC_FILE" ]; then
  echo "Warning: Spec file '$SPEC_FILE' already exists. Skipping..."
  exit 0
fi

# Extract component name from file
FILENAME=$(basename "$COMPONENT_FILE" .ts)
# Convert kebab-case to PascalCase
COMPONENT_NAME=$(echo "$FILENAME" | sed -r 's/(^|-)([a-z])/\U\2/g')

# Extract component selector from the file
SELECTOR=$(grep -oP "selector:\s*['\"].*?['\"]" "$COMPONENT_FILE" | head -1 | sed "s/selector: //" | tr -d "',\"")

# Determine relative path for imports
COMPONENT_DIR=$(dirname "$COMPONENT_FILE")

# Create spec file
cat > "$SPEC_FILE" << EOF
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ${COMPONENT_NAME} } from './${FILENAME}';
// TODO: Import required services and models
// import { SomeService } from 'src/app/common/services';
// import { SomeModel } from 'src/app/common/models';
// import { MatDialog } from '@angular/material/dialog';
// import { of } from 'rxjs';

describe('${COMPONENT_NAME}', () => {
  let component: ${COMPONENT_NAME};
  let fixture: ComponentFixture<${COMPONENT_NAME}>;
  // TODO: Add mock service declarations
  // let mockService: jasmine.SpyObj<SomeService>;

  beforeEach(waitForAsync(() => {
    // TODO: Create spy objects for dependencies
    // mockService = jasmine.createSpyObj('SomeService', ['method1', 'method2']);

    TestBed.configureTestingModule({
      declarations: [${COMPONENT_NAME}],
      providers: [
        // TODO: Add providers
        // { provide: SomeService, useValue: mockService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(${COMPONENT_NAME});
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Uncomment if needed
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Add more tests for component methods
  // Example:
  // describe('someMethod', () => {
  //   it('should do something', () => {
  //     // Arrange
  //     const expectedResult = { success: true, message: '', model: [] };
  //     mockService.someMethod.and.returnValue(of(expectedResult));
  //     
  //     // Act
  //     component.someMethod();
  //     
  //     // Assert
  //     expect(mockService.someMethod).toHaveBeenCalled();
  //     expect(component.someData).toEqual(expectedResult.model);
  //   });
  // });
});
EOF

echo "✓ Created spec file: $SPEC_FILE"
echo ""
echo "Next steps:"
echo "1. Open $SPEC_FILE"
echo "2. Import required services and models"
echo "3. Create mock objects for dependencies"
echo "4. Add test cases for all public methods"
echo "5. Refer to TESTING.md for patterns and examples"
echo ""
echo "Example spec files to reference:"
echo "  - src/app/modules/advanced/components/units/units.component.spec.ts"
echo "  - src/app/modules/advanced/components/workers/workers.component.spec.ts"
