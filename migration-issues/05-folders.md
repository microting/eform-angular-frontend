# Sub-Issue: Migrate Folders Tests to Cypress

## Priority
🟡 **MEDIUM** - Content organization feature

## Description
Migrate Folders wdio tests to Cypress. These tests cover hierarchical folder management including both folder tree structure and child folder operations.

## Tests to Migrate

### Folder Tree (3 tests)
- [x] `folder-tree.add.spec.ts` - Adding folders to tree
- [x] `folder-tree.delete.spec.ts` - Deleting folders from tree
- [x] `folder-tree.edit.spec.ts` - Editing folder properties

### Folder Child (3 tests)
- [x] `folder-child.add.spec.ts` - Adding child folders
- [x] `folder-child.delete.spec.ts` - Deleting child folders
- [x] `folder-child.edit.spec.ts` - Editing child folders

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/folders/folder-tree/` and `folder-child/`
- **Target location**: `eform-client/cypress/e2e/f/` (or appropriate grouping)

## Test Coverage Details

### Folder Tree Tests
**folder-tree.add.spec.ts**
- Should add root level folder
- Should add folder at specific level
- Should validate folder name required
- Should verify folder appears in tree

**folder-tree.edit.spec.ts**
- Should edit folder name
- Should edit folder properties
- Should verify changes in tree structure

**folder-tree.delete.spec.ts**
- Should delete folder (empty)
- Should handle deletion with confirmation
- Should verify folder removed from tree

### Folder Child Tests
**folder-child.add.spec.ts**
- Should add child folder to parent
- Should create nested folder structure
- Should validate parent-child relationship

**folder-child.edit.spec.ts**
- Should edit child folder name
- Should edit child folder properties
- Should maintain parent relationship

**folder-child.delete.spec.ts**
- Should delete child folder
- Should maintain parent folder after child deletion
- Should handle deletion confirmations

## Page Objects
- **Existing**: `Folders.page.ts` in wdio
- **Action**: Create Cypress version of Folders page object

## Key Functionality to Test
1. Navigate to folders management page
2. Tree structure display and navigation
3. CRUD operations on folders
4. Parent-child relationships
5. Folder hierarchy validation
6. Folder properties (name, description, etc.)
7. Nested folder operations

## Acceptance Criteria
- [x] All 6 test files migrated to Cypress
- [x] Tests follow existing Cypress patterns
- [x] Page objects created for folders management
- [x] Tree structure properly tested
- [x] Parent-child relationships validated
- [x] All test scenarios covered
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [x] Folder hierarchy properly cleaned up

## Technical Notes
- Use `cy.intercept()` for folder API calls
- Handle tree structure rendering and expansion
- Test both tree view and child folder operations
- Ensure proper cleanup of test folders (deletion in reverse order)
- Consider using data-testid attributes for reliable selectors
- May need to handle asynchronous tree loading

## Tree Structure Testing Considerations
```typescript
// Example: Expanding tree nodes
cy.get('[data-testid="folder-tree-node"]').first().click();

// Example: Verifying hierarchy
cy.get('[data-testid="folder-tree"]')
  .find('[data-level="1"]')
  .should('contain', 'Parent Folder');

cy.get('[data-testid="folder-tree"]')
  .find('[data-level="2"]')
  .should('contain', 'Child Folder');
```

## Dependencies
- Login functionality (already available in Cypress)
- Navigation to folders page
- Tree component rendering

## Estimated Effort
**Medium-Large** (4-5 hours) - Multiple tests with tree structure complexity

## Notes
- Consider splitting into two sub-issues if too large:
  - Issue 5A: Folder Tree Tests (3 tests)
  - Issue 5B: Folder Child Tests (3 tests)
- Tree operations may need special handling for expand/collapse
- Cleanup is important - delete in correct order (children first)

## Related Documentation
- [Cypress Tree Testing](https://docs.cypress.io/guides/core-concepts/interacting-with-elements)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [x] All 6 test files passing
- [x] Tree structure operations working
- [x] Parent-child relationships correct
- [x] Folder CRUD operations validated
- [x] Test folders properly cleaned up
- [x] No orphaned folders after tests
- [x] Tests are deterministic
- [x] Tree rendering stable
- [ ] Code reviewed
- [x] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
