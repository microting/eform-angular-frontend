import loginPage from '../Login.page';
import applicationSettingsPage from '../ApplicationSettings.page';

const applicationSettingsConstants = {
  LoginPage: {
    originalMainText: 'eForm Backend',
    customMainText: 'Custom login page main text',
    originalSecondaryText: 'No more paper-forms and back-office data entry',
    customSecondaryText: 'Custom login page secondary text'
  }
};

describe('Application settings - Login page section', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should change main text', () => {
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for login page settings to be visible
    applicationSettingsPage.LoginPage.getMainTextInput().should('be.visible', { timeout: 240000 });
    
    // Set custom main text
    applicationSettingsPage.LoginPage.getMainTextInput()
      .clear()
      .type(applicationSettingsConstants.LoginPage.customMainText);
    
    // Save settings
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.save();
    
    // Logout to see changes
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.Navbar.logout();
    
    // Verify main text changed on login page
    loginPage.getUsernameInput().should('be.visible', { timeout: 40000 });
    loginPage.getLoginButton().should('be.visible');
    loginPage.getMainText().should('have.text', applicationSettingsConstants.LoginPage.customMainText);
  });

  it('should change secondary text', () => {
    loginPage.login();
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for login page settings to be visible
    applicationSettingsPage.LoginPage.getSecondaryTextInput().should('be.visible', { timeout: 240000 });
    
    // Set custom secondary text
    applicationSettingsPage.LoginPage.getSecondaryTextInput()
      .clear()
      .type(applicationSettingsConstants.LoginPage.customSecondaryText);
    
    // Save settings
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.save();
    
    // Logout to see changes
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.Navbar.logout();
    
    // Verify secondary text changed on login page
    loginPage.getUsernameInput().should('be.visible', { timeout: 40000 });
    loginPage.getLoginButton().should('be.visible');
    loginPage.getSecondaryText().should('have.text', applicationSettingsConstants.LoginPage.customSecondaryText);
  });

  it('should hide main text', () => {
    loginPage.login();
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for login page settings to be visible
    applicationSettingsPage.LoginPage.getMainTextVisibilityToggleBtn().should('be.visible', { timeout: 240000 });
    
    // Toggle main text visibility
    applicationSettingsPage.LoginPage.getMainTextVisibilityToggleBtn().click();
    
    // Save settings
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.save();
    
    // Logout to see changes
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.Navbar.logout();
    
    // Verify main text is hidden on login page
    loginPage.getUsernameInput().should('be.visible', { timeout: 40000 });
    loginPage.getLoginButton().should('be.visible');
    loginPage.getMainText().should('not.be.visible');
  });

  it('should hide secondary text', () => {
    loginPage.login();
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for login page settings to be visible
    applicationSettingsPage.LoginPage.getSecondaryTextVisibilityToggleBtn().should('be.visible', { timeout: 240000 });
    
    // Toggle secondary text visibility
    applicationSettingsPage.LoginPage.getSecondaryTextVisibilityToggleBtn().click();
    
    // Save settings
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.save();
    
    // Logout to see changes
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.Navbar.logout();
    
    // Verify secondary text is hidden on login page
    loginPage.getUsernameInput().should('be.visible', { timeout: 40000 });
    loginPage.getLoginButton().should('be.visible');
    loginPage.getSecondaryText().should('not.be.visible');
  });

  it('should hide image', () => {
    loginPage.login();
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for login page settings to be visible
    applicationSettingsPage.LoginPage.getImageVisibilityToggler().should('be.visible', { timeout: 240000 });
    
    // Toggle image visibility
    applicationSettingsPage.LoginPage.getImageVisibilityToggler().click();
    
    // Save settings
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    applicationSettingsPage.save();
    
    // Logout to see changes
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    cy.wait(1000);
    applicationSettingsPage.Navbar.logout();
    
    // Verify image is hidden on login page
    loginPage.getLoginButton().should('be.visible');
    loginPage.getImage().should('not.be.visible');
  });

  it('should reset main text', () => {
    loginPage.login();
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for site header settings to be visible (after reset, we're on the settings page)
    applicationSettingsPage.SiteHeader.getMainTextInput().should('be.visible', { timeout: 240000 });
    
    // Reset login page settings
    applicationSettingsPage.LoginPage.reset();
    
    // Wait for settings to be visible again
    applicationSettingsPage.SiteHeader.getMainTextInput().should('be.visible', { timeout: 240000 });
    
    // Logout to verify reset
    applicationSettingsPage.Navbar.logout();
    
    // Verify main text is reset to original on login page
    loginPage.getLoginButton().should('be.visible');
    loginPage.getMainText().should('have.text', applicationSettingsConstants.LoginPage.originalMainText);
  });
});
