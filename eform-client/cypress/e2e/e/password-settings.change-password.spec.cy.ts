import loginPage from '../Login.page';
import passwordSettingsPage from '../PasswordSettings.page';

describe('Password settings - Change password', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should change password and revert it back', () => {
    // Navigate to password settings
    passwordSettingsPage.Navbar.goToPasswordSettings();
    cy.get('#oldPassword', { timeout: 10000 }).should('be.visible');
    
    // Change password to new password
    passwordSettingsPage.setNewPassword();

    // Logout
    passwordSettingsPage.Navbar.logout();
    cy.get('#loginBtn', { timeout: 10000 }).should('be.visible');

    // Login with new password to verify change worked
    cy.visit('http://localhost:4200');
    loginPage.loginWithNewPassword();

    // Verify we're logged in by checking for the new eForm button
    cy.get('#newEFormBtn', { timeout: 10000 }).should('be.visible');

    // Navigate to password settings to revert
    passwordSettingsPage.Navbar.goToPasswordSettings();
    cy.get('#oldPassword', { timeout: 10000 }).should('be.visible');
    
    // Revert password back to original
    passwordSettingsPage.revertToOldPassword();

    // Logout
    passwordSettingsPage.Navbar.logout();
    cy.get('#loginBtn', { timeout: 10000 }).should('be.visible');

    // Login with original password to verify revert worked
    cy.visit('http://localhost:4200');
    loginPage.login();

    // Verify we're logged in
    cy.get('#newEFormBtn', { timeout: 10000 }).should('be.visible');
  });
});
