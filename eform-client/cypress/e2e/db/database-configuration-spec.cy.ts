import databasePage from '../Database.page';
import DatabaseConfigurationConstants from '../../../e2e/Constants/DatabaseConfigurationConstants'
import loginPage from '../Login.page';

describe('Database', () => {
  it('should be configured successfully', () => {
    cy.visit('http://localhost:4200/connection-string');
    databasePage.languageDropdown().should('be.visible');
    cy.wait(5000);
    databasePage.firstNameInput().should('be.visible');
    databasePage.lastNameInput().should('be.visible');
    databasePage.emailInput().should('be.visible');
    databasePage.passwordInput().should('be.visible');
    databasePage.customerNo().should('be.visible');
    databasePage.tokenInput().should('be.visible');
    databasePage.authenticationType().should('be.visible');
    databasePage.languageDropdown().should('be.visible');

    databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
    databasePage.save();
    cy.wait(120000);
    loginPage.getLoginButton().should('be.visible');
  });
});
