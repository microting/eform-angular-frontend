# Sub-Issue: Migrate Device Users Tests to Cypress

## Priority
🔴 **HIGH** - Critical for mobile device user management testing

## Description
Migrate Device Users wdio tests to Cypress. Device users represent mobile device operators who use the eForm mobile application. These tests cover the complete CRUD lifecycle.

## Tests to Migrate

- [ ] `device-users.add.spec.ts` - Creating device users with validation
- [ ] `device-users.delete.spec.ts` - Deleting device users
- [ ] `device-users.edit.spec.ts` - Editing device user details

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/device-users/`
- **Target location**: `eform-client/cypress/e2e/d/` (or appropriate grouping)

## Test Coverage Details

### device-users.add.spec.ts
- Should add new device user with first name and last name
- Should NOT add device user with only first name (validation)
- Should NOT add device user with only last name (validation)
- Should NOT add device user without first and last names (validation)
- Should NOT create user if cancel was clicked
- Should clean up created test data

### device-users.edit.spec.ts
- Should edit device user's first name
- Should edit device user's last name
- Should edit both first name and last name
- Should validate required fields during edit

### device-users.delete.spec.ts
- Should delete device user successfully
- Should confirm deletion in modal dialog
- Should cancel deletion when cancel is clicked

## Page Objects
- **Existing**: `DeviceUsers.page.ts` in `eform-client/e2e/Page objects/`
- **Action**: Create/adapt Cypress version in `eform-client/cypress/e2e/`

## Key Functionality to Test
1. Navigate to Device Users page via navbar
2. Create device user with validation (both fields required)
3. Edit device user details
4. Delete device user with confirmation
5. Row counting and data verification

## Acceptance Criteria
- [ ] All 3 test files migrated to Cypress
- [ ] Tests follow existing Cypress patterns (see `cypress/e2e/a/`, `cypress/e2e/b/`)
- [ ] Page objects created/adapted for Cypress
- [ ] All test scenarios from wdio tests are covered
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Code follows Cypress best practices (proper use of cy.intercept, cy.wait, etc.)

## Technical Notes
- Use `cy.intercept()` for API calls related to device users
- Ensure proper cleanup in `afterEach` hooks
- Use existing `loginPage` pattern for authentication
- Reference existing Cypress tests for patterns (e.g., `my-eforms.delete-eform.spec.cy.ts`)

## Dependencies
- Existing Page Objects in wdio format
- Login functionality (already available in Cypress)
- Navbar navigation (already available in Cypress)

## Estimated Effort
**Medium** (2-3 hours) - Straightforward CRUD operations with existing patterns to follow

## Related Documentation
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] All test scenarios pass
- [ ] No console errors during test execution
- [ ] Tests are deterministic (no flaky tests)
- [ ] Test data is properly cleaned up
- [ ] Page objects are reusable
- [ ] Code reviewed and follows project conventions
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
