import loginPage from '../Login.page';
import {generateRandmString} from '../helper-functions';

describe('Subheader test', function () {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // it('element must be moved from templates to list, must navigate on created menu item and translate must be == translate', function () {
  //   const testValue = generateRandmString();
  //
  //   cy.intercept('GET', '**/api/navigation-menu').as('loadMenu');
  //   cy.get('#sign-out-dropdown').click();
  //   cy.get('#menu-editor').click();
  //   cy.wait('@loadMenu', { timeout: 30000 });
  //
  //   cy.get('#mat-expansion-panel-header-2 > .mat-expansion-indicator').click();
  //   cy.get('#dragHandle0_0').trigger('mousedown', {which: 1});
  //   cy.get('mat-card > mat-accordion').trigger('mousemove', 'top').trigger('mouseup', {force: true});
  //   cy.get('#mat-expansion-panel-header-2 > .mat-expansion-indicator').click();
  //
  //   cy.intercept('POST', '**/api/navigation-menu').as('saveMenu');
  //   cy.get('#navigationMenuSaveBtn').click();
  //   cy.wait('@saveMenu', { timeout: 30000 });
  //
  //   cy.get('#editBtn').first().click();
  //   cy.get('#editItemTranslation0_0_1').should('have.value', 'Mine eForms').type(`{selectall}{backspace}${testValue}`);
  //
  //   cy.intercept('POST', '**/api/navigation-menu').as('saveMenuEdit');
  //   cy.get('#editItemSaveBtn').click();
  //   cy.wait('@saveMenuEdit', { timeout: 30000 });
  //
  //   cy.intercept('POST', '**/api/navigation-menu').as('saveMenuFinal');
  //   cy.get('#navigationMenuSaveBtn').click();
  //   cy.wait('@saveMenuFinal', { timeout: 30000 });
  //
  //   cy.get('#my-eforms').should('have.text', ` ${testValue} `).click();
  //   cy.get('h2').should('have.text', ` ${testValue} `);
  // });
  afterEach(() => {
    cy.intercept('GET', '**/api/navigation-menu').as('loadMenu2');
    cy.get('#sign-out-dropdown').click();
    cy.get('#menu-editor').click();
    cy.wait('@loadMenu2', { timeout: 30000 });

    cy.intercept('POST', '**/api/navigation-menu/reset').as('resetMenu');
    cy.get('#resetBtn').click();
    cy.get('#deleteWorkerDeleteBtn').click();
    cy.wait('@resetMenu', { timeout: 30000 });
  });
});
