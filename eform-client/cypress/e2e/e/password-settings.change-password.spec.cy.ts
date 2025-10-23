import loginPage from '../Login.page';
import passwordSettingsPage from '../PasswordSettings.page';

describe('Password settings - Change password', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    passwordSettingsPage.Navbar.goToPasswordSettings();
    cy.get('#oldPassword', { timeout: 10000 }).should('be.visible');
  });

  it('should change password to new password', () => {
    // Change password to new password
    passwordSettingsPage.setNewPassword();

    // Logout
    passwordSettingsPage.Navbar.logout();
    cy.get('#loginBtn').should('be.visible');

    // Login with new password
    cy.visit('http://localhost:4200');
    loginPage.loginWithNewPassword();

    // Verify we're logged in by checking for the new eForm button
    cy.get('#newEFormBtn').should('be.visible');

    // Navigate to password settings
    passwordSettingsPage.Navbar.goToPasswordSettings();
    cy.get('#oldPassword').should('be.visible');
  });

  it('should revert password back to original', () => {
    // Revert password back to original
    passwordSettingsPage.revertToOldPassword();

    // Logout
    passwordSettingsPage.Navbar.logout();
    cy.get('#loginBtn').should('be.visible');

    // Login with original password
    cy.visit('http://localhost:4200');
    loginPage.login();

    // Verify we're logged in
    cy.get('#newEFormBtn').should('be.visible');

    // Navigate to password settings to verify we can access it
    passwordSettingsPage.Navbar.goToPasswordSettings();
    cy.get('#oldPassword').should('be.visible');
  });
});
