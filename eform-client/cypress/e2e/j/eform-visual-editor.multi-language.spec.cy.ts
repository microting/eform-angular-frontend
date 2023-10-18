import loginPage from '../Login.page';

// @ts-ignore
describe('My eforms', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should create eform with 2 sub eForms and copied fields inside of them',() => {
    cy.intercept('GET', '**/api/tags/index').as('getTags');
    cy.get('#eformsVisualEditor').click();
    cy.wait('@getTags', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_0').clear('Hovedtitel');
    cy.get('#mainCheckListNameTranslation_0').type('Hovedtitel');
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('lvl 1');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.get('#initialChecklistCreateBtn > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').clear();
    cy.get('#newChecklistNameTranslation_0').type('lvl 1.1');
    cy.get('#changeChecklistSaveBtn').click();
    cy.wait(2000);
    cy.intercept('POST', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait('@saveeForm', { timeout: 60000 });
    // cy.wait(10000);
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    cy.get('#languageCheckbox1 > .mat-checkbox-layout').click();
    // @ts-ignore
    cy.get('#mainCheckListNameTranslation_1').clear('M');
    cy.get('#mainCheckListNameTranslation_1').type('Maintitle');
    cy.get('#editChecklistBtn0').click();
    // @ts-ignore
    cy.get('#newChecklistNameTranslation_1').clear('l');
    cy.get('#newChecklistNameTranslation_1').type('lvl1e');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.wait(2000);
    cy.get('#editChecklistBtn1').click();
    // @ts-ignore
    cy.get('#newChecklistNameTranslation_1').clear('l');
    cy.get('#newChecklistNameTranslation_1').type('lvl1.1e');
    cy.get('#changeChecklistSaveBtn > .mat-button-wrapper').click();
    cy.intercept('PUT', '**/api/template-visual-editor/').as('saveeForm');
    cy.get('#saveCreateEformBtn > .mat-button-wrapper').click();
    cy.wait(2000);
    cy.wait('@saveeForm', { timeout: 60000 });
    cy.intercept('GET', '**/api/template-visual-editor/**').as('geteForm');
    cy.get('#edit-eform-btn-0 > .mat-button-wrapper > .mat-icon').click();
    cy.wait('@geteForm', { timeout: 60000 });
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#mainCheckListNameTranslation_0').should('have.value', 'Hovedtitel');
    cy.get('#mainCheckListNameTranslation_1').should('have.value', 'Maintitle');
    cy.get('#editChecklistBtn0').click();
    cy.get('#newChecklistNameTranslation_0').should('have.value', 'lvl 1');
    cy.get('#newChecklistNameTranslation_1').should('have.value', 'lvl1e');
    cy.get('#changeChecklistSaveCancelBtn').click();
    cy.get('#editChecklistBtn1 > .mat-button-wrapper > .mat-icon').click();
    cy.get('#newChecklistNameTranslation_0').should('have.value', 'lvl 1.1');
    cy.get('#newChecklistNameTranslation_1').should('have.value', 'lvl1.1e');
    cy.get('#changeChecklistSaveCancelBtn > .mat-button-wrapper').click();
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
