# Sub-Issue: Migrate Searchable Lists Tests to Cypress

## Priority
🟡 **MEDIUM** - Data entry feature

## Description
Migrate Searchable Lists wdio tests to Cypress. Searchable lists are dropdown components with search functionality used in eForms for data entry.

## Tests to Migrate

- [x] `searchable-lists.add.spec.ts` - Creating searchable lists
- [x] `searchable-lists.delete.spec.ts` - Deleting searchable lists
- [x] `searchable-lists.edit.spec.ts` - Editing searchable lists

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/searchable-lists/`
- **Target location**: `eform-client/cypress/e2e/h/` (or appropriate grouping)

## Test Coverage Details

### searchable-lists.add.spec.ts
- Should create new searchable list
- Should add list name
- Should add list items/values
- Should validate required fields
- Should verify list appears in management view

### searchable-lists.edit.spec.ts
- Should edit searchable list name
- Should add new items to existing list
- Should remove items from list
- Should reorder list items
- Should save changes successfully

### searchable-lists.delete.spec.ts
- Should delete searchable list
- Should confirm deletion
- Should verify list removed
- Should handle cancel deletion

## Page Objects
- **Action**: Create page objects for searchable lists in Cypress
- **Reference**: Check if page object exists in wdio version

## Key Functionality to Test
1. Navigate to searchable lists management
2. Create new searchable list
3. Add list items/values
4. Edit list name and items
5. Reorder items (if supported)
6. Delete lists
7. Validate list usage in eForms (optional)
8. Search functionality within lists

## Acceptance Criteria
- [x] All 3 test files migrated to Cypress
- [x] Tests follow existing Cypress patterns
- [x] Page objects created for searchable lists
- [x] All CRUD operations tested
- [x] List item management tested
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Test lists properly cleaned up

## Technical Notes
- Use `cy.intercept()` for searchable lists API calls
- Handle list item collection (add/remove/reorder)
- Test both management interface and list rendering
- Ensure proper cleanup of test lists
- May need to interact with ng-select or similar dropdown components

## Working with Dropdowns in Cypress
```typescript
// ng-select example
cy.get('.ng-select-container').click();
cy.get('.ng-select-dropdown-panel').contains('Option 1').click();

// Or using custom commands if available
cy.selectValue('fieldId', 'Option 1');
```

## Dependencies
- Login functionality (already available in Cypress)
- Navigation to lists management
- Helper functions for ng-select if used

## Estimated Effort
**Small-Medium** (2-3 hours) - Standard CRUD with collection management

## Related Documentation
- [Cypress ng-select Testing](https://github.com/ng-select/ng-select/blob/master/TESTING.md)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [x] All 3 test files passing
- [x] Lists created/edited/deleted correctly
- [x] List items managed correctly
- [ ] Search functionality working
- [x] Test data properly cleaned up
- [x] No leftover lists after tests
- [ ] Tests are deterministic
- [ ] Code reviewed
- [x] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
