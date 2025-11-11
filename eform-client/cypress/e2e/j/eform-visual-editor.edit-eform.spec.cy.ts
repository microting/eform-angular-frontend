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

  afterEach(() => {
    // Clean up - delete created eForm
    navbar.goToMyEForms();
    myEformsPage.clearEFormTable();
  });
});
