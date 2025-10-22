# WDIO to Cypress Migration Tracking

## Overview

This document tracks the migration of WebDriverIO (wdio) e2e tests to Cypress tests. The goal is to modernize our testing infrastructure by migrating all tests from wdio to Cypress.

## Current Status

- **Total wdio tests**: 38
- **Cypress tests implemented**: 27
- **Tests remaining to migrate**: 23

## Tests Already Migrated to Cypress ✓

The following wdio tests have been successfully migrated to Cypress:

### Database Configuration
- ✓ database-configuration.spec.ts (cypress/e2e/db/)

### Main Page eForms (My eForms)
- ✓ my-eforms.create-eform.spec.ts (cypress/e2e/a/)
- ✓ my-eforms.filter-eform.spec.ts (cypress/e2e/a/)
- ✓ my-eforms.sort-eform.spec.ts (cypress/e2e/a/)
- ✓ my-eforms.delete-eform.spec.ts (cypress/e2e/b/)
- ✓ my-eforms.pairing-eform.spec.ts (cypress/e2e/b/)
- ✓ my-eforms.tags-eform.spec.ts (cypress/e2e/b/)

### Sites
- ✓ site-tag.multi.spec.ts (cypress/e2e/b/)

### Navigation Menu
- ✓ subheader.spec.ts (cypress/e2e/c/)

### eForm Visual Editor
- ✓ eform-visual-editor.edit-eform.spec.ts (cypress/e2e/j/)
- ✓ eform-visual-editor.edit-xml.spec.ts (cypress/e2e/j/)
- ✓ eform-visual-editor.multi-language.spec.ts (cypress/e2e/j/)

### Password Settings
- ✓ password-settings.change-password.spec.ts (cypress/e2e/e/)

### User Administration
- ✓ user-administration.name-change.spec.ts (cypress/e2e/e/)

## Tests to Migrate (23 tests)

The following tests need to be migrated from wdio to Cypress. They are organized by functional area for easier sub-issue creation.

### 1. Application Settings (2 tests)

**Category**: Application Configuration and Settings  
**Priority**: Medium  
**Location**: e2e/Tests/application-settings/

Tests to migrate:
- [ ] application-settings.login-page.spec.ts
- [ ] application-settings.site-header.spec.ts

**Description**: Tests for application-level settings including login page configuration and site header customization.

---

### 2. Device Users (3 tests) ✓

**Category**: Device User Management  
**Priority**: High  
**Location**: e2e/Tests/device-users/  
**Migrated to**: cypress/e2e/d/

Tests migrated:
- ✓ device-users.add.spec.cy.ts
- ✓ device-users.delete.spec.cy.ts
- ✓ device-users.edit.spec.cy.ts

**Description**: Tests for CRUD operations on device users (mobile device operators who use the eForm mobile app).

**Key Functionality**:
- Creating device users with first name and last name
- Validation that both fields are required
- Editing device user details
- Deleting device users

---

### 3. eForm Visual Editor - Create (1 test)

**Category**: eForm Visual Editor  
**Priority**: High  
**Location**: e2e/Tests/eform-visual-editor/

Tests to migrate:
- [ ] eform-visual-editor.create-eform.spec.ts

**Description**: Tests for creating eForms using the visual editor. The edit functionality is already migrated.

**Note**: Related tests (edit-eform, edit-xml, multi-language) are already migrated in cypress/e2e/j/

---

### 4. Folders - Folder Tree (3 tests)

**Category**: Folder Management - Tree Structure  
**Priority**: Medium  
**Location**: e2e/Tests/folders/folder-tree/

Tests to migrate:
- [ ] folder-tree.add.spec.ts
- [ ] folder-tree.delete.spec.ts
- [ ] folder-tree.edit.spec.ts

**Description**: Tests for hierarchical folder tree management including creating, editing, and deleting folder nodes.

---

### 5. Folders - Folder Child (3 tests)

**Category**: Folder Management - Child Folders  
**Priority**: Medium  
**Location**: e2e/Tests/folders/folder-child/

Tests to migrate:
- [ ] folder-child.add.spec.ts
- [ ] folder-child.delete.spec.ts
- [ ] folder-child.edit.spec.ts

**Description**: Tests for child folder management within the folder hierarchy.

---

### 6. Navigation Menu (4 tests)

**Category**: Navigation Menu Management  
**Priority**: Medium  
**Location**: e2e/Tests/navigation-menu/

Tests to migrate:
- [ ] navigation-menu.create-item.spec.ts
- [ ] navigation-menu.delete-item.spec.ts
- [ ] navigation-menu.drag-item.spec.ts
- [ ] navigation-menu.edit-item.spec.ts

**Description**: Tests for customizing and managing navigation menu items including drag-and-drop reordering.

**Note**: subheader.spec.ts is already migrated in cypress/e2e/c/

---

### 7. Password Settings (1 test) ✓

**Category**: User Security Settings  
**Priority**: High  
**Location**: e2e/Tests/password-settings/  
**Migrated to**: cypress/e2e/e/

Tests migrated:
- ✓ password-settings.change-password.spec.cy.ts

**Description**: Tests for user password change functionality and validation.

**Key Functionality**:
- Changing password with valid inputs
- Reverting password back to original
- Login with new password verification
- Password field validation

---

### 8. Profile Settings (1 test)

**Category**: User Profile Settings  
**Priority**: Medium  
**Location**: e2e/Tests/profile-settings/

Tests to migrate:
- [ ] profile-settings.language.spec.ts

**Description**: Tests for changing user interface language preferences.

---

### 9. Searchable Lists (3 tests)

**Category**: Searchable Lists Management  
**Priority**: Medium  
**Location**: e2e/Tests/searchable-lists/

Tests to migrate:
- [ ] searchable-lists.add.spec.ts
- [ ] searchable-lists.delete.spec.ts
- [ ] searchable-lists.edit.spec.ts

**Description**: Tests for managing searchable dropdown lists used in eForms.

---

### 10. Selectable Lists (4 tests)

**Category**: Selectable Lists Management  
**Priority**: Medium  
**Location**: e2e/Tests/selectable-lists/

Tests to migrate:
- [ ] selectable-lists.add.spec.ts
- [ ] selectable-lists.delete.spec.ts
- [ ] selectable-lists.edit.spec.ts
- [ ] selectable-lists.sort.spec.ts

**Description**: Tests for managing selectable lists (radio button/checkbox options) including sorting functionality.

---

### 11. User Administration (1 test) ✓

**Category**: User Management  
**Priority**: High  
**Location**: e2e/Tests/user-administration/  
**Migrated to**: cypress/e2e/e/

Tests migrated:
- ✓ user-administration.name-change.spec.cy.ts

**Description**: Tests for managing user accounts and changing user names.

**Key Functionality**:
- Editing user first and last names
- Creating new users with role and group
- Changing user roles
- Deleting users
- Password field handling

---

### 12. Workers (2 tests)

**Category**: Worker Management  
**Priority**: Medium  
**Location**: e2e/Tests/workers/

Tests to migrate:
- [ ] workers.add.spec.ts
- [ ] workers.edit.spec.ts

**Description**: Tests for managing worker records (staff members) in the system.

---

## Migration Guidelines

### Test Structure

When migrating tests from wdio to Cypress, follow these patterns:

1. **File Location**: Place Cypress tests in `eform-client/cypress/e2e/` organized by test suite groups (a, b, c, d, e, f, g, h, i, j)
2. **File Naming**: Use `.spec.cy.ts` extension instead of `.spec.ts`
3. **Page Objects**: Reuse/adapt existing page objects from `eform-client/cypress/e2e/` directory
4. **Test Structure**: Follow the pattern used in existing Cypress tests

### Cypress Test Pattern

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
    // Cleanup if needed
  });
});
```

### Key Differences from wdio

1. **Async/Await**: Cypress commands are automatically chained and don't require async/await
2. **Element Selection**: Use `cy.get()` instead of `$()` or `await $()`
3. **Waits**: Use `cy.wait()` or built-in retry-ability instead of `waitForDisplayed()`
4. **Assertions**: Use `cy.should()` or `expect()` from Chai
5. **Intercepts**: Use `cy.intercept()` for API mocking instead of wdio network utilities

### Testing Commands

```bash
# Run all Cypress tests
yarn cypress:open

# Run Cypress tests headlessly
yarn cypress:run

# Run wdio tests (existing)
yarn testheadless2a  # through yarn testheadless2j
```

## Sub-Issue Creation Template

When creating GitHub issues for each category, use this template:

```markdown
## Description
Migrate [Category Name] wdio tests to Cypress

## Tests to Migrate
- [ ] test-name-1.spec.ts
- [ ] test-name-2.spec.ts
- [ ] test-name-3.spec.ts

## Location
- **wdio tests**: `e2e/Tests/[category-path]/`
- **Cypress tests**: `cypress/e2e/[letter]/` (determine appropriate grouping)

## Acceptance Criteria
- [ ] All listed tests migrated to Cypress
- [ ] Tests follow Cypress patterns and conventions
- [ ] Page objects created/updated as needed
- [ ] Tests pass in CI/CD pipeline
- [ ] Original wdio tests can be marked for deprecation

## Related Tests
[List any related tests that are already migrated or dependent]

## Priority
[High/Medium/Low based on category]
```

## Progress Tracking

Use this section to track overall migration progress:

- [ ] Application Settings (2 tests)
- [x] Device Users (3 tests) ✓
- [ ] eForm Visual Editor - Create (1 test)
- [ ] Folders - Folder Tree (3 tests)
- [ ] Folders - Folder Child (3 tests)
- [ ] Navigation Menu (4 tests)
- [x] Password Settings (1 test) ✓
- [ ] Profile Settings (1 test)
- [ ] Searchable Lists (3 tests)
- [ ] Selectable Lists (4 tests)
- [x] User Administration (1 test) ✓
- [ ] Workers (2 tests)

**Total Progress**: 5/28 tests migrated (17.9%)

## Notes

- Each category can be handled as a separate sub-issue
- Tests can be migrated incrementally
- Original wdio tests should remain until Cypress equivalents are verified
- Update this document as tests are migrated
- Consider grouping related tests for efficient migration

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [Migration from WebDriverIO](https://docs.cypress.io/guides/migrating-to-cypress/webdriverio)
- Existing Cypress tests in `eform-client/cypress/e2e/`
- Testing documentation in `eform-client/TESTING.md`
