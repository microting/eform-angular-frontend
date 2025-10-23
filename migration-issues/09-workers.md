# Sub-Issue: Migrate Workers Tests to Cypress

## Priority
🟡 **MEDIUM** - Staff management feature

## Description
Migrate Workers wdio tests to Cypress. Workers represent staff members in the system who can be assigned to tasks and eForms.

## Tests to Migrate

- [ ] `workers.add.spec.ts` - Creating worker records
- [ ] `workers.edit.spec.ts` - Editing worker information

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/workers/`
- **Target location**: `eform-client/cypress/e2e/h/` or `i/` (or appropriate grouping)

## Test Coverage Details

### workers.add.spec.ts
- Should navigate to workers page
- Should create new worker
- Should add worker first name
- Should add worker last name
- Should add worker email (if applicable)
- Should validate required fields
- Should verify worker appears in list

### workers.edit.spec.ts
- Should edit worker's first name
- Should edit worker's last name
- Should edit worker's email
- Should edit worker's properties
- Should save changes successfully
- Should verify updates in worker list

## Page Objects
- **Action**: Create/adapt page objects for workers in Cypress
- **Reference**: Check if Workers page object exists in wdio version

## Key Functionality to Test
1. Navigate to workers management page
2. Create new worker with required information
3. Validate required fields (name, etc.)
4. Edit worker details
5. Save and verify changes
6. List/table display of workers
7. Worker search/filter (if applicable)

## Acceptance Criteria
- [ ] Both test files migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page objects created for workers management
- [ ] All worker operations tested
- [ ] Validation rules enforced
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Test workers properly cleaned up

## Technical Notes
- Use `cy.intercept()` for workers API calls
- Handle worker creation and editing forms
- Test validation (required fields)
- Ensure test workers are deleted after tests
- May need to handle worker-device user relationship (if exists)

## Dependencies
- Login functionality (already available in Cypress)
- Navigation to workers page
- Form validation patterns

## Comparison with Device Users
Workers are similar to Device Users but represent different user types:
- **Device Users**: Mobile device operators
- **Workers**: Staff members (may or may not have devices)

Reference the Device Users migration (Issue #1) for similar patterns.

## Estimated Effort
**Small-Medium** (2 hours) - Similar to Device Users with 2 tests instead of 3

## Related Documentation
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)
- Device Users migration for similar patterns

## Verification Checklist
Before closing this issue:
- [ ] Both test files passing
- [ ] Workers created correctly
- [ ] Workers edited correctly
- [ ] Validation working
- [ ] Test data properly cleaned up
- [ ] No leftover workers after tests
- [ ] Tests are deterministic
- [ ] Code reviewed
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
