import loginPage from '../Login.page';
import {myEformsPage, myEformsRowObject} from '../MyEforms.page';
import { v4 as uuidv4 } from 'uuid';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';
import {selectValueInNgSelectorNoSelector} from "../helper-functions";


// @ts-ignore
describe('My eforms', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should create eform without any tags',() => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#eformsVisualEditor').click();
    cy.wait(5000);
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
    cy.get('#fieldNameTranslation_0').clear('g');
    cy.get('#fieldNameTranslation_0').type('gem');
    cy.get('#defaultValueEdit0').clear('g');
    cy.get('#defaultValueEdit0').type('gem');
    cy.get('#changeFieldSaveBtn').click();
    cy.get('#addNewNestedField0 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').clear();
    cy.get('#fieldTypeSelector > .ng-select-searchable > .ng-select-container > .ng-value-container > .ng-input > input').type('bil');
    cy.get('.cdk-drag').click();
    cy.get('#fieldNameTranslation_0').clear('b');
    cy.get('#fieldNameTranslation_0').type('billede 1');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#fieldSection1 > .mb-3 > .p-2 > .d-flex > #copyBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldSection2 > .mb-3 > .p-2 > .d-flex > #editBtn > .mat-button-wrapper > .mat-icon').click();
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
    cy.get('#minValueEdit').clear('0');
    cy.get('#minValueEdit').type('0');
    cy.get('#maxValueEdit').clear();
    cy.get('#maxValueEdit').type('10');
    cy.get('#decimalCountEdit').clear();
    cy.get('#decimalCountEdit').type('2');
    cy.get('#changeFieldSaveBtn').click();
    cy.get('#fields_1 > app-visual-editor-field > #fieldSection1 > .mb-3 > .p-2 > .d-flex > #copyBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fields_1 > app-visual-editor-field > #fieldSection2 > .mb-3 > .p-2 > .d-flex > #editBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#fieldNameTranslation_0').clear('skriv et tal ');
    cy.get('#fieldNameTranslation_0').type('skriv et tal 2');
    cy.get('#changeFieldSaveBtn > .mat-button-wrapper').click();
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait(5000);
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    /* ==== End Cypress Studio ==== */
  });
});
