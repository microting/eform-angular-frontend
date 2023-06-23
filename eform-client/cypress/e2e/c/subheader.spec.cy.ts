import loginPage from 'cypress/e2e/Login.page';
import {generateRandmString} from 'cypress/e2e/helper-functions';

describe('Subheader test', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  it('element must be moved from templates to list, must navigate on created menu item and translate must be == translate', function () {
    const testValue = generateRandmString();
    cy.get('#sign-out-dropdown').click();
    cy.get('#menu-editor').click();
    cy.wait(500);
    // cy.get('#menuItems').should('have.length', 3);
    cy.get('#mat-expansion-panel-header-2 > .mat-expansion-indicator').click();
    cy.get('#dragHandle0_0').trigger('mousedown', {which: 1});
    cy.get('mat-card > mat-accordion').trigger('mousemove', 'top').trigger('mouseup', {force: true});
    cy.get('#mat-expansion-panel-header-2 > .mat-expansion-indicator').click();
    cy.get('#navigationMenuSaveBtn').click();
    // cy.get('#menuItems').should('have.length', 4);
    cy.get('#editBtn').first().click();
    cy.wait(300);
    cy.get('#editItemTranslation0_0_1').should('have.value', 'Mine eForms').type(`{selectall}{backspace}${testValue}`);
    cy.get('#editItemSaveBtn > .mat-button-wrapper').click();
    cy.get('#navigationMenuSaveBtn > .mat-button-wrapper').click();
    cy.get('#my-eforms').should('have.text', ` ${testValue} `).click();
    cy.get('h2').should('have.text', ` ${testValue} `);
  });
  afterEach(() => {
    cy.get('#sign-out-dropdown').click();
    cy.get('#menu-editor').click();
    cy.wait(500);
    cy.get('#resetBtn').click();
    cy.get('#deleteWorkerDeleteBtn').click();
  });
});
