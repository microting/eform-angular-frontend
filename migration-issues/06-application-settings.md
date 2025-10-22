# Sub-Issue: Migrate Application Settings Tests to Cypress

## Priority
🟡 **MEDIUM** - Configuration and branding features

## Description
Migrate Application Settings wdio tests to Cypress. These tests cover application-level configuration including login page customization and site header settings.

## Tests to Migrate

- [ ] `application-settings.login-page.spec.ts` - Login page configuration
- [ ] `application-settings.site-header.spec.ts` - Site header customization

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/application-settings/`
- **Target location**: `eform-client/cypress/e2e/g/` (or appropriate grouping)

## Test Coverage Details

### application-settings.login-page.spec.ts
- Should customize login page background image
- Should customize login page logo
- Should customize login page text/title
- Should preview login page changes
- Should save login page configuration
- Should verify changes appear on login page

### application-settings.site-header.spec.ts
- Should customize site header logo
- Should customize site header text
- Should customize site header colors/theme
- Should save header configuration
- Should verify changes appear in header

## Page Objects
- **Action**: Create page objects for application settings in Cypress
- **Reference**: Check wdio version for existing patterns

## Key Functionality to Test
1. Navigate to application settings page
2. Access login page customization section
3. Upload/select images (logo, background)
4. Edit text fields (title, subtitle)
5. Color/theme selection
6. Preview functionality
7. Save configuration
8. Verify changes on actual pages (login, header)
9. Reset/restore default settings

## Acceptance Criteria
- [ ] Both test files migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page objects created for settings pages
- [ ] Image upload functionality tested
- [ ] Text customization tested
- [ ] Preview functionality validated
- [ ] Changes persist correctly
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Settings properly reset after tests

## Technical Notes
- **File Upload**: Use `cy.fixture()` for test images
- Use `cy.intercept()` for settings API calls
- May need to handle image upload/preview
- Verify changes on both settings page and target pages
- Ensure settings reset to defaults after tests

## Cypress File Upload Example
```typescript
// Upload image
cy.get('input[type="file"]').attachFile('test-logo.png');

// Or using selectFile (Cypress 9.3+)
cy.get('input[type="file"]').selectFile('cypress/fixtures/test-logo.png');
```

## Test Data Requirements
- Test images (logo, background) in fixtures folder
- Default settings for restoration
- Test text values for customization

## Dependencies
- Login functionality (already available in Cypress)
- File upload capability in Cypress
- Navigation to settings page

## Estimated Effort
**Medium** (2-3 hours) - Image handling adds complexity

## Related Documentation
- [Cypress File Upload](https://docs.cypress.io/api/commands/selectfile)
- [Cypress Fixtures](https://docs.cypress.io/api/commands/fixture)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] Both test files passing
- [ ] Image uploads working
- [ ] Text customization working
- [ ] Preview functionality validated
- [ ] Changes visible on target pages
- [ ] Settings properly reset
- [ ] No leftover test images/config
- [ ] Tests are deterministic
- [ ] Code reviewed
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
