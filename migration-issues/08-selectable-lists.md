# Sub-Issue: Migrate Selectable Lists Tests to Cypress

## Priority
🟡 **MEDIUM** - Data entry feature

## Description
Migrate Selectable Lists wdio tests to Cypress. Selectable lists are option lists (radio buttons/checkboxes) used in eForms, with additional sorting functionality.

## Tests to Migrate

- [ ] `selectable-lists.add.spec.ts` - Creating selectable lists
- [ ] `selectable-lists.delete.spec.ts` - Deleting selectable lists
- [ ] `selectable-lists.edit.spec.ts` - Editing selectable lists
- [ ] `selectable-lists.sort.spec.ts` - Sorting list items

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/selectable-lists/`
- **Target location**: `eform-client/cypress/e2e/i/` (or appropriate grouping)

## Test Coverage Details

### selectable-lists.add.spec.ts
- Should create new selectable list
- Should add list name
- Should add list options/items
- Should validate required fields
- Should verify list appears in management view

### selectable-lists.edit.spec.ts
- Should edit selectable list name
- Should add new options to existing list
- Should remove options from list
- Should modify option labels
- Should save changes successfully

### selectable-lists.sort.spec.ts
- Should reorder list items via drag-and-drop or buttons
- Should save new item order
- Should verify order persists
- Should test sorting in both directions (up/down)

### selectable-lists.delete.spec.ts
- Should delete selectable list
- Should confirm deletion
- Should verify list removed
- Should handle cancel deletion

## Page Objects
- **Action**: Create page objects for selectable lists in Cypress
- **Reference**: Check if page object exists in wdio version

## Key Functionality to Test
1. Navigate to selectable lists management
2. Create new selectable list
3. Add list options/items
4. Edit list name and options
5. Sort/reorder options
6. Delete lists
7. Validate option rendering in eForms (optional)

## Acceptance Criteria
- [ ] All 4 test files migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page objects created for selectable lists
- [ ] All CRUD operations tested
- [ ] List item sorting tested
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Test lists properly cleaned up

## Technical Notes
- Use `cy.intercept()` for selectable lists API calls
- Handle list option collection (add/remove/reorder)
- **Sorting**: May use drag-and-drop or up/down buttons
  - If drag-and-drop, refer to navigation-menu migration (Issue #4)
- Test both management interface and list rendering
- Ensure proper cleanup of test lists

## Drag-and-Drop Sorting (if applicable)
```typescript
// Using cypress-drag-drop plugin
cy.get('.list-item').first().drag('.list-item').last();

// Or manual events
cy.get('.list-item').first()
  .trigger('mousedown')
  .trigger('mousemove', { clientX: 100, clientY: 100 })
  .trigger('mouseup');
```

## Button-Based Sorting (if applicable)
```typescript
// Move item up
cy.get('.list-item').first().find('.move-up-btn').click();

// Move item down
cy.get('.list-item').first().find('.move-down-btn').click();
```

## Dependencies
- Login functionality (already available in Cypress)
- Navigation to lists management
- Drag-and-drop or sorting mechanism

## Estimated Effort
**Medium** (3-4 hours) - CRUD plus sorting complexity

## Related Documentation
- [Cypress Drag and Drop](https://docs.cypress.io/api/commands/trigger)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] All 4 test files passing
- [ ] Lists created/edited/deleted correctly
- [ ] Options managed correctly
- [ ] Sorting working reliably
- [ ] Sort order persists
- [ ] Test data properly cleaned up
- [ ] No leftover lists after tests
- [ ] Tests are not flaky
- [ ] Code reviewed
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
