import loginPage from '../Login.page';
import {selectValueInNgSelectorNoSelector} from '../helper-functions';
import { Navbar } from '../Navbar.page';
import { myEformsPage } from '../MyEforms.page';

const navbar = new Navbar();


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
    cy.get('#mainCheckListNameTranslation_1').click().clear().type('Mit nye navn');
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type('Første niveau');
    cy.get('#changeChecklistSaveBtn').click();
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('gem');
    selectValueInNgSelectorNoSelector('GemKnap');
    cy.get('#fieldNameTranslation_0').clear().type('gem');
    cy.get('#defaultValueEdit0').clear().type('gem');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('bil');
    selectValueInNgSelectorNoSelector('Billed');
    cy.get('#fieldNameTranslation_0').clear().type('billede 1');
    cy.get('#changeFieldSaveBtn').click();
    cy.get('#fieldSection1 #copyBtn').click();
    cy.get('#fieldSection2 #editBtn').click();
    cy.get('#fieldNameTranslation_0').clear().type('billede 2');
    cy.get('#changeFieldSaveBtn').click();
    cy.get('#initialChecklistCreateBtn').click();
    cy.get('#newChecklistNameTranslation_0').clear().type('andet niveau');
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').clear().type('tæller');
    selectValueInNgSelectorNoSelector('Tæller');
    cy.get('#fieldNameTranslation_0').type('tæl op');
    cy.get('#minValueEdit').click().clear().type('2');
    cy.get('#maxValueEdit').click().clear().type('10');
    cy.get('#decimalCountEdit').click().clear().type('2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#addNewNestedField0').click();
    cy.get('#fieldTypeSelector input').click().type('Numerisk');
    selectValueInNgSelectorNoSelector('Numerisk');
    cy.get('#fieldNameTranslation_0').clear().type('skriv et tal');
    cy.get('#minValueEdit').clear().type('0');
    cy.get('#maxValueEdit').clear().type('10');
    cy.get('#decimalCountEdit').clear().type('2');
    cy.get('#changeFieldSaveBtn').click();
    cy.wait(2000);
    cy.get('#fields_0 #fieldSection1 #copyBtn').click();
    cy.get('#fields_0 #fieldSection2 #editBtn').click();
    // @ts-ignore
    cy.get('#fieldNameTranslation_0').clear('skriv et tal ');
    cy.get('#fieldNameTranslation_0').type('skriv et tal 2');
    cy.get('#changeFieldSaveBtn').click();
    // /api/template-visual-editor/
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== End Cypress Studio ==== */
  });

  // it('should create an eForm with 2 levels, save and then add fields in 2nd edit', function () {
  //   Cypress.config('defaultCommandTimeout', 20000);
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('Hovedtitel');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('Level 1');
  //   cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait(2000);
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('Level 1.1');
  //   cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(1000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#addNewNestedField0 > .mat-button-wrapper > mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   cy.wait(1000);
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('Billed');
  //   cy.get('#fieldNameTranslation_0').type('Billede 1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(2000);
  //   cy.get('#addNewNestedField1 > .mat-button-wrapper > mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('B');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   cy.get('.mat-dialog-content > .mat-card.ng-star-inserted > .mat-card-content > .d-flex > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
  //   cy.get('#fieldNameTranslation_0').clear();
  //   cy.get('#fieldNameTranslation_0').type('Billede 2');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  //
  // it('should create an eForm with 2 levels, save and then add groups and fields in 2nd edit', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('Hovedtitel');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('Level 1');
  //   cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(1000);
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('Level 1.1');
  //   cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(1000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#addNewNestedField0').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('G');
  //   cy.get('#fieldNameTranslation_0').type('Gruppe 1');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.get('#addNewNestedField1').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('G');
  //   cy.get('#fieldNameTranslation_0').type('Gruppe 2');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bille');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   cy.get('.mat-dialog-content > .mat-card.ng-star-inserted > .mat-card-content > .d-flex > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').click();
  //   cy.get('#fieldNameTranslation_0').clear();
  //   cy.get('#fieldNameTranslation_0').type('Billede 1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('Bille');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('B');
  //   cy.get('#fieldNameTranslation_0').type('Billed 2');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  //
  // it('should create an eForm with 2 levels, save and then add groups, then save and add fields in 2nd edit', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('H');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hoved titel');
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('lvl 1');
  //   cy.wait(1000);
  //   cy.get('#changeChecklistSaveBtn').click();
  //   cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#newChecklistNameTranslation_0').clear();
  //   cy.get('#newChecklistNameTranslation_0').type('lvl 1.1');
  //   cy.get('#changeChecklistSaveBtn').click();
  //   cy.wait(1000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('group1');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.get('#addNewNestedField1').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('group2');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#fields_0 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('billede 1');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.get('#fields_1 > .field-group > #fieldSection0 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('billede 2');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  //
  // it('should create an eForm, save and then add 1 group, save and then add fields', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('h');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   // cy.wait(10000);
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(2000);
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('b1');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  // //
  // it('should create an eForm add 1 group, save and then add fields', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('h');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.wait(2000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   // cy.wait(10000);
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('b1');
  //   cy.get('#changeFieldSaveBtn').click();
  //   cy.wait(2000);
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  //
  // it('should create an eForm add 1 group and add fields', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('h');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('b1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait(2000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   // cy.wait(10000);
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  // //
  // it('should create an eForm add 1 group and add fields, save and then add additional group', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('h');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('b1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait(2000);
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   // cy.wait(10000);
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g2');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });
  //
  // it('should create an eForm add 1 group and add fields, save and then add additional group with fields', function () {
  //   cy.intercept('GET', '**/api/tags/index').as('getTags');
  //   cy.get('#eformsVisualEditor').click();
  //   cy.wait('@getTags', { timeout: 60000 });
  //   /* ==== Generated with Cypress Studio ==== */
  //   // @ts-ignore
  //   cy.get('#mainCheckListNameTranslation_0').clear('h');
  //   cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('b');
  //   cy.get('#fieldNameTranslation_0').type('b1');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.get('#collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   // cy.wait(10000);
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  //   /* ==== Generated with Cypress Studio ==== */
  //   cy.get('#initialFieldCreateBtn').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('gr');
  //   selectValueInNgSelectorNoSelector('Gruppe');
  //   // @ts-ignore
  //   cy.get('#fieldNameTranslation_0').clear('g');
  //   cy.get('#fieldNameTranslation_0').type('g2');
  //   cy.get('#changeFieldSaveBtn >s .mat-button-wrapper').click();
  //   cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #collapseToggleBtn > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #addNewNestedField > .mat-button-wrapper > .mat-icon').click();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
  //   cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bi');
  //   selectValueInNgSelectorNoSelector('Billed');
  //   cy.get('#fieldNameTranslation_0').clear();
  //   cy.get('#fieldNameTranslation_0').type('b2');
  //   cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
  //   cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
  //   cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
  //   cy.wait('@saveeForm', { timeout: 60000 });
  //   cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
  //   cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
  //   cy.wait('@geteForm', { timeout: 60000 });
  //   /* ==== End Cypress Studio ==== */
  // });

  afterEach(() => {
    // Clean up - delete created eForm
    navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
