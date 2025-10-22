# Sub-Issue: Migrate Navigation Menu Tests to Cypress

## Priority
🟡 **MEDIUM** - UI customization feature

## Description
Migrate Navigation Menu wdio tests to Cypress. These tests cover customizing and managing navigation menu items including drag-and-drop functionality.

## Tests to Migrate

- [ ] `navigation-menu.create-item.spec.ts` - Creating menu items
- [ ] `navigation-menu.delete-item.spec.ts` - Deleting menu items
- [ ] `navigation-menu.edit-item.spec.ts` - Editing menu items
- [ ] `navigation-menu.drag-item.spec.ts` - Reordering via drag-and-drop

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/navigation-menu/`
- **Target location**: `eform-client/cypress/e2e/c/` (subheader is already there)

## Already Migrated
✅ `subheader.spec.ts` - Already in `cypress/e2e/c/`

## Test Coverage Details

### navigation-menu.create-item.spec.ts
- Should create new navigation menu item
- Should set menu item name/label
- Should set menu item link/URL
- Should set menu item icon (if applicable)
- Should validate required fields
- Should verify item appears in menu

### navigation-menu.edit-item.spec.ts
- Should edit existing menu item name
- Should edit menu item link
- Should edit menu item icon
- Should save changes successfully
- Should verify changes reflect in menu

### navigation-menu.delete-item.spec.ts
- Should delete menu item with confirmation
- Should verify item removed from menu
- Should handle cancel deletion

### navigation-menu.drag-item.spec.ts
- Should drag and drop menu item to reorder
- Should save new menu order
- Should verify order persists after page reload
- Should handle drag to different positions

## Page Objects
- **Action**: Adapt/extend existing navigation page objects for Cypress
- **Reference**: `Navbar.page.ts` exists in wdio

## Key Functionality to Test
1. Navigate to navigation menu settings/customization
2. CRUD operations on menu items
3. Drag-and-drop reordering
4. Menu item properties (name, link, icon, order)
5. Validation rules
6. Menu rendering and display

## Acceptance Criteria
- [ ] All 4 test files migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page objects adapted for navigation menu management
- [ ] Drag-and-drop functionality working in Cypress
- [ ] All test scenarios covered
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Menu state properly reset between tests

## Technical Notes
- **Drag-and-Drop**: Cypress has specific commands/plugins for D&D
  - Consider using `@4tw/cypress-drag-drop` plugin if not already available
  - Or use native `.trigger()` events
- Use `cy.intercept()` for menu API calls
- Ensure menu state is reset/cleaned up after tests
- Test both menu configuration and rendered menu display

## Cypress Drag-and-Drop Example
```typescript
// Option 1: Using plugin
cy.get('.menu-item').first().drag('.menu-item').last();

// Option 2: Using native events
cy.get('.menu-item').first()
  .trigger('mousedown', { which: 1 })
  .trigger('mousemove', { clientX: 100, clientY: 100 })
  .trigger('mouseup');
```

## Dependencies
- Login functionality (already available in Cypress)
- Navigation to menu settings
- Subheader tests (already migrated)

## Estimated Effort
**Medium** (3-4 hours) - Multiple tests with drag-and-drop complexity

## Related Documentation
- [Cypress Drag and Drop](https://docs.cypress.io/api/commands/trigger)
- [Cypress Real Events](https://github.com/dmtrKovalenko/cypress-real-events)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] All 4 test files passing
- [ ] Drag-and-drop working reliably
- [ ] Menu items created/edited/deleted correctly
- [ ] Menu order persists
- [ ] No leftover menu items after tests
- [ ] Tests are not flaky
- [ ] Cross-browser compatibility checked
- [ ] Code reviewed
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
