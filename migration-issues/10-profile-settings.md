# Sub-Issue: Migrate Profile Settings Tests to Cypress

## Priority
🟡 **MEDIUM** - User preferences feature

## Description
Migrate Profile Settings wdio test to Cypress. This test covers user interface language preference changes.

## Tests to Migrate

- [ ] `profile-settings.language.spec.ts` - Language preference selection

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/profile-settings/`
- **Target location**: `eform-client/cypress/e2e/e/` (with password settings)

## Test Coverage Details

### profile-settings.language.spec.ts
- Should navigate to profile settings
- Should display available languages
- Should select different language
- Should save language preference
- Should verify UI updates to selected language
- Should verify language preference persists after logout/login
- Should test multiple language switches

## Page Objects
- **Action**: Create page object for profile settings in Cypress
- **May share**: Can potentially share with password settings page object

## Key Functionality to Test
1. Navigate to profile/user settings page
2. Access language selection dropdown/options
3. Select different language
4. Save preference
5. Verify UI text updates to selected language
6. Test key UI elements in new language
7. Logout and login to verify persistence
8. Switch back to original language (cleanup)

## Available Languages
Common languages to test (verify actual availability):
- English (en)
- Danish (da)
- German (de)
- Spanish (es)
- French (fr)
- Polish (pl)
- Ukrainian (uk)
- Norwegian (no)
- Swedish (sv)

## Acceptance Criteria
- [ ] Test file migrated to Cypress
- [ ] Tests follow existing Cypress patterns
- [ ] Page object created for profile settings
- [ ] Language switching tested
- [ ] UI updates verified
- [ ] Preference persistence tested
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [ ] Language reset to default after test

## Technical Notes
- Use `cy.intercept()` for language/profile API calls
- Verify text changes in multiple UI elements
- Handle i18n/translation loading
- Store original language to restore after test
- Consider testing at least 2-3 different languages

## Testing Language Switch Example
```typescript
// Save original language
let originalLanguage;
cy.get('[data-testid="language-selector"]')
  .invoke('val')
  .then(val => originalLanguage = val);

// Switch language
cy.get('[data-testid="language-selector"]').select('Danish');
cy.get('[data-testid="save-settings"]').click();

// Verify UI updated
cy.contains('Dashboard').should('not.exist');
cy.contains('Kontrolpanel').should('be.visible'); // Danish for Dashboard

// Restore original
cy.get('[data-testid="language-selector"]').select(originalLanguage);
cy.get('[data-testid="save-settings"]').click();
```

## Dependencies
- Login functionality (already available in Cypress)
- i18n/translation system
- Profile settings navigation
- Available language translations

## Estimated Effort
**Small** (1-2 hours) - Single test with UI verification

## Related Documentation
- [Cypress i18n Testing](https://docs.cypress.io/guides/references/configuration#Internationalization)
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] Test file passing
- [ ] Language switches correctly
- [ ] UI updates verified
- [ ] Preference persists after login
- [ ] Multiple languages tested
- [ ] Language restored to default
- [ ] No translation errors
- [ ] Test is deterministic
- [ ] Code reviewed
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
