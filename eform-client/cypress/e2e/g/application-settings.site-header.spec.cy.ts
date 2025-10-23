import loginPage from '../Login.page';
import applicationSettingsPage from '../ApplicationSettings.page';

describe('Application settings - Site header section', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should hide image', () => {
    applicationSettingsPage.Navbar.goToApplicationSettings();
    
    // Wait for spinner to disappear
    cy.get('#spinner-animation').should('not.exist');
    
    // Wait for sign-out dropdown to be visible
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    
    // Toggle site header image visibility
    applicationSettingsPage.SiteHeader.getImageVisibilityToggler().should('be.visible').click();
    
    // Save settings
    applicationSettingsPage.save();
    
    // Wait for save to complete
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    
    // Navigate to application settings page to refresh
    cy.visit('http://localhost:4200/application-settings');
    cy.get('#sign-out-dropdown').should('be.visible', { timeout: 40000 });
    
    // Navigate to home page to see changes
    cy.visit('http://localhost:4200/');
    
    // Verify image is hidden in site header
    applicationSettingsPage.getSiteHeaderImage().should('not.be.visible');
  });
});
