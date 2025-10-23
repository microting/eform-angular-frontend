# Sub-Issue: Migrate Password Settings Tests to Cypress

## Priority
🔴 **HIGH** - Security-critical functionality

## Description
Migrate Password Settings wdio test to Cypress. This test covers user password change functionality and validation rules.

## Tests to Migrate

- [ ] `password-settings.change-password.spec.ts` - Password change with validation

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/password-settings/`
- **Target location**: `eform-client/cypress/e2e/e/` (or appropriate grouping)

## Test Coverage Details

### password-settings.change-password.spec.ts
- Should navigate to password settings
- Should change password successfully with valid inputs
- Should validate current password is correct
- Should validate new password meets requirements
- Should validate password confirmation matches
- Should show appropriate error messages for invalid inputs
- Should handle password change failure scenarios

## Page Objects
- **Action**: Create Page Object for password settings in Cypress
- **Reference**: Check if password settings page object exists in wdio version

## Key Functionality to Test
1. Navigate to password/profile settings page
2. Enter current password
3. Enter new password
4. Confirm new password
5. Validate password requirements (length, complexity, etc.)
6. Submit password change
7. Verify success/error messages
8. Test with invalid scenarios:
   - Wrong current password
   - Mismatched password confirmation
   - Weak password (if validation exists)

## Acceptance Criteria
- [ ] Test file migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page object created for password settings page
- [ ] All validation scenarios covered
- [ ] Success and error paths tested
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Proper handling of sensitive data (no password logging)

## Technical Notes
- Use `cy.intercept()` for password change API calls
- Handle authentication/session management properly
- Clear any test user credentials after test completion
- Use secure password fixtures (don't hardcode real passwords)
- Consider using environment variables for test credentials

## Security Considerations
- ⚠️ **Do not log passwords** in test output
- ⚠️ Use test/dummy passwords only
- ⚠️ Ensure test user is properly cleaned up
- ⚠️ Validate HTTPS is used for password submission (if applicable)

## Dependencies
- Login functionality (already available in Cypress)
- User profile/settings navigation
- Test user account with known password

## Estimated Effort
**Small-Medium** (1-2 hours) - Single test file but requires careful handling of security aspects

## Related Documentation
- [Cypress Environment Variables](https://docs.cypress.io/guides/guides/environment-variables)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] Test scenarios pass
- [ ] No passwords logged in console or test output
- [ ] Test user credentials properly managed
- [ ] All validation rules tested
- [ ] Error messages verified
- [ ] Success message verified
- [ ] Test is deterministic
- [ ] Code reviewed for security issues
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
