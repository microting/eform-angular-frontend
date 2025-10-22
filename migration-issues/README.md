# Migration Sub-Issues

This directory contains detailed specifications for each sub-issue in the wdio to Cypress migration project.

## Sub-Issue List

| # | Title | Priority | Tests | Status |
|---|-------|----------|-------|--------|
| 01 | [Device Users](01-device-users.md) | 🔴 HIGH | 3 | ✅ Complete |
| 02 | [Password Settings](02-password-settings.md) | 🔴 HIGH | 1 | ✅ Complete |
| 03 | [User Administration](03-user-administration.md) | 🔴 HIGH | 1 | ✅ Complete |
| 04 | [Navigation Menu](04-navigation-menu.md) | 🟡 MEDIUM | 4 | ✅ Complete |
| 05 | [Folders](05-folders.md) | 🟡 MEDIUM | 6 | ✅ Complete |
| 06 | [Application Settings](06-application-settings.md) | 🟡 MEDIUM | 2 | ✅ Complete |
| 07 | [Searchable Lists](07-searchable-lists.md) | 🟡 MEDIUM | 3 | ✅ Complete |
| 08 | [Selectable Lists](08-selectable-lists.md) | 🟡 MEDIUM | 4 | ✅ Complete |
| 09 | [Workers](09-workers.md) | 🟡 MEDIUM | 2 | ✅ Complete |
| 10 | [Profile Settings](10-profile-settings.md) | 🟡 MEDIUM | 1 | ⏳ Pending |
| 11 | [eForm Visual Editor - Create](11-eform-visual-editor-create.md) | 🔴 HIGH | 1 | ✅ Complete |
| | **TOTAL** | | **28** | **89% Complete** |

## How to Use These Sub-Issues

### Creating GitHub Issues

Each markdown file can be used as a template for creating a GitHub issue:

1. Open the relevant sub-issue file (e.g., `01-device-users.md`)
2. Copy the entire content
3. Create a new GitHub issue
4. Paste the content as the issue description
5. Add appropriate labels:
   - `testing`
   - `cypress`
   - `e2e`
   - `migration`
   - `high-priority` or `medium-priority`
6. Assign to the appropriate developer/team

### Working on a Sub-Issue

When implementing a sub-issue:

1. **Read the full specification** - Each file contains:
   - Priority and description
   - List of tests to migrate
   - Detailed test coverage information
   - Technical notes and patterns
   - Dependencies and prerequisites
   - Verification checklist

2. **Follow the patterns** - Reference:
   - Existing Cypress tests in `eform-client/cypress/e2e/`
   - Page objects and helper functions
   - Technical notes specific to that feature

3. **Use the checklist** - Each sub-issue has an acceptance criteria and verification checklist

4. **Update progress** - When complete:
   - Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
   - Mark tests as complete in the main document
   - Close the GitHub issue

## Priority Guide

### 🔴 HIGH Priority (5 tests)
Critical functionality that should be migrated first:
- Device Users (mobile app operations)
- Password Settings (security)
- User Administration (user management)
- eForm Visual Editor - Create (core feature)

### 🟡 MEDIUM Priority (23 tests)
Important features that can be migrated after high priority:
- Navigation Menu (UI customization)
- Folders (content organization)
- Application Settings (configuration)
- Lists (data entry - searchable & selectable)
- Workers (staff management)
- Profile Settings (user preferences)

## Recommended Order

### Phase 1 - Core Features (High Priority)
1. Device Users (3 tests) ✅
2. Password Settings (1 test) ✅
3. User Administration (1 test) ✅
4. eForm Visual Editor - Create (1 test) ✅

### Phase 2 - UI & Navigation (Medium Priority)
5. Navigation Menu (4 tests)
6. Application Settings (2 tests)
7. Profile Settings (1 test)

### Phase 3 - Data Organization (Medium Priority)
8. Folders (6 tests) - *Could be split into two issues*
9. Searchable Lists (3 tests)
10. Selectable Lists (4 tests)

### Phase 4 - Staff Management (Medium Priority)
11. Workers (2 tests)

## Common Patterns Across All Sub-Issues

### Test Structure
```typescript
import loginPage from '../Login.page';

describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should perform action', () => {
    // Test implementation
  });

  afterEach(() => {
    // Cleanup
  });
});
```

### API Interception
```typescript
cy.intercept('GET', '**/api/endpoint').as('getEndpoint');
cy.get('#triggerBtn').click();
cy.wait('@getEndpoint', { timeout: 60000 });
```

### Element Interaction
```typescript
// Click
cy.get('#buttonId').click();

// Type
cy.get('#inputId').clear().type('text');

// Select
cy.get('#selectId').select('option');

// Assert
cy.get('#elementId').should('be.visible');
cy.get('#elementId').should('contain', 'text');
```

## Questions?

- **Main Migration Plan**: See [WDIO_TO_CYPRESS_MIGRATION.md](../WDIO_TO_CYPRESS_MIGRATION.md)
- **Quick Summary**: See [MIGRATION_SUMMARY.md](../MIGRATION_SUMMARY.md)
- **Testing Guide**: See [eform-client/TESTING.md](../eform-client/TESTING.md)
- **Cypress Docs**: https://docs.cypress.io/
