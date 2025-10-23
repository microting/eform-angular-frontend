# Sub-Issue: Migrate eForm Visual Editor Create Tests to Cypress

## Priority
🔴 **HIGH** - Core eForm creation functionality

## Description
Migrate eForm Visual Editor creation test to Cypress. This complements the already-migrated edit functionality to provide complete coverage of the visual editor.

## Tests to Migrate

- [x] `eform-visual-editor.create-eform.spec.ts` - Creating eForms from scratch ✅ **MIGRATED**

## Current Location
- **wdio tests**: `eform-client/e2e/Tests/eform-visual-editor/`
- **Target location**: `eform-client/cypress/e2e/j/` (with other visual editor tests)

## Already Migrated
✅ `eform-visual-editor.edit-eform.spec.ts` - In `cypress/e2e/j/`  
✅ `eform-visual-editor.edit-xml.spec.ts` - In `cypress/e2e/j/`  
✅ `eform-visual-editor.multi-language.spec.ts` - In `cypress/e2e/j/`

## Test Coverage Details

### eform-visual-editor.create-eform.spec.ts
- Should navigate to visual editor
- Should create new eForm from scratch
- Should add eForm title/name
- Should add fields (text, number, picture, etc.)
- Should add field groups
- Should add validation rules
- Should save new eForm
- Should verify eForm appears in my eForms list
- Should be able to edit newly created eForm

## Page Objects
- **Existing**: Visual editor page objects may already exist from edit tests
- **Action**: Reuse/extend existing page objects for create scenarios

## Key Functionality to Test
1. Navigate to eForm Visual Editor
2. Start new eForm creation
3. Set eForm basic properties (title, description)
4. Add various field types:
   - Text input
   - Number input
   - Date/Time
   - Picture/Photo
   - Signature
   - CheckBox
   - Select/Dropdown
5. Configure field properties
6. Add field groups/sections
7. Set validation rules
8. Preview eForm (if available)
9. Save eForm
10. Verify in eForm list

## Acceptance Criteria
- [x] Test file migrated to Cypress
- [x] Tests follow existing Cypress patterns in j/ folder
- [x] Reuse existing visual editor page objects
- [x] Complete create workflow tested
- [x] Multiple field types tested
- [x] Validation rules tested
- [ ] Tests pass locally
- [ ] Tests pass in CI/CD pipeline
- [x] Created eForms properly cleaned up

## Technical Notes
- Reference existing edit tests in `cypress/e2e/j/` for patterns
- Use `cy.intercept()` for visual editor API calls
- Use existing helpers like `selectValueInNgSelectorNoSelector()` from `helper-functions.ts`
- Ensure consistent test data naming with UUID/GUID
- Clean up created eForms in `afterEach` hooks
- May need longer timeouts for complex eForm saves

## Visual Editor Patterns (from existing tests)
```typescript
// From eform-visual-editor.edit-eform.spec.cy.ts
cy.intercept('GET', '**/api/tags/index').as('getTags');
cy.get('#eformsVisualEditor').click();
cy.wait('@getTags', { timeout: 60000 });

// Adding fields
cy.get('#initialFieldCreateBtn').click();
cy.get('#fieldTypeSelector input').clear().type('text');
selectValueInNgSelectorNoSelector('Text');
cy.get('#fieldNameTranslation_0').clear().type('Field Name');
cy.get('#changeFieldSaveBtn').click();

// Saving eForm
cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
cy.get('#saveCreateEformBtn').click();
cy.wait('@saveeForm', { timeout: 60000 });
```

## Field Types to Test
Based on common eForm fields:
- Text (short and long)
- Number/Numeric
- Date
- Time
- DateTime
- Picture/Photo
- Signature
- CheckBox
- Select List
- Multi-Select
- Save Button
- Comment

## Dependencies
- Login functionality (already available in Cypress)
- Visual editor navigation
- Existing edit test patterns (reference)
- Helper functions from `cypress/e2e/helper-functions.ts`

## Estimated Effort
**Medium** (3-4 hours) - Can leverage existing patterns from edit tests

## Related Documentation
- Existing tests: `cypress/e2e/j/eform-visual-editor.edit-eform.spec.cy.ts`
- Helper functions: `cypress/e2e/helper-functions.ts`
- [Full Migration Plan](../WDIO_TO_CYPRESS_MIGRATION.md)
- [Testing Documentation](../eform-client/TESTING.md)

## Verification Checklist
Before closing this issue:
- [ ] Test file passing
- [ ] Create workflow complete
- [ ] Multiple field types tested
- [ ] eForm saved successfully
- [ ] eForm appears in list
- [ ] Can edit created eForm
- [ ] Test eForms cleaned up
- [ ] Tests are deterministic
- [ ] No test data leakage
- [ ] Code reviewed
- [ ] Consistent with edit test patterns
- [ ] Update `WDIO_TO_CYPRESS_MIGRATION.md` progress tracking
