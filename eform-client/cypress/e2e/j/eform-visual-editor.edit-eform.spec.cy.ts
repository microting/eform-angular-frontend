import loginPage from '../Login.page';
import {selectValueInNgSelectorNoSelector} from '../helper-functions';


// @ts-ignore
describe('My eforms', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should create eform with 2 sub eForms and copied fields inside of them',() => {
    /* ==== Generated with Cypress Studio ==== */
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    // cy.wait(5000);
    cy.get('.d-flex > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    cy.get('#mainCheckListNameTranslation_0').clear();
    cy.get('#mainCheckListNameTranslation_0').type('Mit nye navn');
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('Første niveau');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gem');
    selectValueInNgSelectorNoSelector('GemKnap');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('gem');
    // @ts-ignore
    cy.get('#defaultValueEdit0').clear('g');
    cy.get('#defaultValueEdit0').type('gem');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bil');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('billede 1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #copyBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldSection2 > .mb-3 > .p-2 > .d-flex > #editBtn > .mat-button-wrapper > .mat-icon').click();
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('billede ');
    cy.get('#fieldNameTranslation_0').type('billede 2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('andet niveau');
    cy.get('#changeChecklistSaveBtn').click();
    cy.get('#addNewNestedField1 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('tæller');
    selectValueInNgSelectorNoSelector('Tæller');
    cy.get('#fieldNameTranslation_0').type('tæl op');
    cy.get('[style="padding-right: 1rem;"] > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    cy.get('#minValueEdit').clear();
    cy.get('#minValueEdit').type('2');
    // @ts-ignore
    cy.get('#maxValueEdit').clear('1');
    cy.get('#maxValueEdit').type('10');
    cy.get('app-visual-editor-additional-field-number.ng-star-inserted > :nth-child(1) > :nth-child(1) > :nth-child(1) > .mat-form-field-hide-placeholder > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    cy.get('#decimalCountEdit').clear();
    cy.get('#decimalCountEdit').type('2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#addNewNestedField1 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('Numerisk');
    selectValueInNgSelectorNoSelector('Numerisk');
    cy.get('#fieldNameTranslation_0').clear();
    cy.get('#fieldNameTranslation_0').type('skriv et tal');
    // @ts-ignore
    cy.get('#minValueEdit').clear('0');
    cy.get('#minValueEdit').type('0');
    cy.get('#maxValueEdit').clear();
    cy.get('#maxValueEdit').type('10');
    cy.get('#decimalCountEdit').clear();
    cy.get('#decimalCountEdit').type('2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#fields_1 > app-visual-editor-field > #fieldSection1 > .mb-3 > .p-2 > .d-flex > #copyBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fields_1 > app-visual-editor-field > #fieldSection2 > .mb-3 > .p-2 > .d-flex > #editBtn > .mat-button-wrapper > .mat-icon').click();
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('skriv et tal ');
    cy.get('#fieldNameTranslation_0').type('skriv et tal 2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    // /api/template-visual-editor/
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm with 2 levels, save and then add fields in 2nd edit', function () {
    Cypress.config('defaultCommandTimeout', 20000);
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('Hovedtitel');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('Level 1');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('Level 1.1');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('Billed');
    cy.get('#fieldNameTranslation_0').type('Billede 1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.wait(2000);
    cy.get('#addNewNestedField1 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('B');
    selectValueInNgSelectorNoSelector('Billed');
    cy.get('.mat-dialog-content > .mat-card.ng-star-inserted > .mat-card-content > .d-flex > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    cy.get('#fieldNameTranslation_0').clear();
    cy.get('#fieldNameTranslation_0').type('Billede 2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm with 2 levels, save and then add groups and fields in 2nd edit', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('Hovedtitel');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('Level 1');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('Level 1.1');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.wait(1000);
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('G');
    cy.get('#fieldNameTranslation_0').type('Gruppe 1');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField1').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('G');
    cy.get('#fieldNameTranslation_0').type('Gruppe 2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bille');
    selectValueInNgSelectorNoSelector('Billed');
    cy.get('.mat-dialog-content > .mat-card.ng-star-inserted > .mat-card-content > .d-flex > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
    cy.get('#fieldNameTranslation_0').clear();
    cy.get('#fieldNameTranslation_0').type('Billede 1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('Bille');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('B');
    cy.get('#fieldNameTranslation_0').type('Billed 2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm with 2 levels, save and then add groups, then save and add fields in 2nd edit', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('H');
    cy.get('#mainCheckListNameTranslation_0').type('Hoved titel');
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('lvl 1');
    cy.get('#changeChecklistSaveBtn').click();
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('lvl 1.1');
    cy.get('#changeChecklistSaveBtn').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('group1');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField1').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('group2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('billede 1');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('billede 2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm, save and then add 1 group, save and then add fields', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('h');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.wait(2000);
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('b1');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });
  //
  it('should create an eForm add 1 group, save and then add fields', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('h');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('b1');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm add 1 group and add fields', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('h');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('b1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });
  //
  it('should create an eForm add 1 group and add fields, save and then add additional group', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('h');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('b1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  it('should create an eForm add 1 group and add fields, save and then add additional group with fields', function () {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('h');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('b1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#initialFieldCreateBtn').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
    selectValueInNgSelectorNoSelector('Gruppe');
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('g2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
    selectValueInNgSelectorNoSelector('Billed');
    cy.get('#fieldNameTranslation_0').clear();
    cy.get('#fieldNameTranslation_0').type('b2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  afterEach(() => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#cancelEditBtn').click();
    cy.get('#delete-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#eFormDeleteDeleteBtn > .mat-button-wrapper').click();
    /* ==== End Cypress Studio ==== */
  });
});
