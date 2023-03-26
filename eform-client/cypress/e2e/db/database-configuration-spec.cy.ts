
import DatabaseConfigurationConstants from '../../../e2e/Constants/DatabaseConfigurationConstants'
describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200');
    cy.get('#spinner-animation').should('not.be.visible');
    cy.get('#firstName').should('be.visible').type(DatabaseConfigurationConstants.firstName);
    cy.get('#lastName').should('be.visible').type(DatabaseConfigurationConstants.lastNAme);
    cy.get('#email').should('be.visible').type(DatabaseConfigurationConstants.email);
    cy.get('#password').should('be.visible').type(DatabaseConfigurationConstants.password);
    cy.get('#customerNo').should('be.visible').type(DatabaseConfigurationConstants.customerNo);
    cy.get('#token').should('be.visible').type(DatabaseConfigurationConstants.token);
    cy.get('#auth2').should('be.visible').type(DatabaseConfigurationConstants.authenticationType);
    cy.get('#host2').should('be.visible').click().focused().clear().type(DatabaseConfigurationConstants.SqlServer);
    cy.get('#languageSelector').should('be.visible').click();
    cy.get('.ng-option .ng-star-inserted').each((item, index, list) => {
      if (item.text() === DatabaseConfigurationConstants.languageOptions.danish) {
        item.click();
      }
      });
    cy.get('#save').should('be.visible').click();
    cy.wait(90000);
    cy.get('#loginBtn').should('be.visible').click();
    })
})
