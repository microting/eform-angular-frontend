import { Navbar } from './Navbar.page';

export class ApplicationSettings {
  public Navbar = new Navbar();

  // Save button
  getSaveBtn() {
    return cy.get('#applicationSettingsSaveBtn');
  }

  save() {
    cy.intercept({method: 'PUT', url: '**/api/settings/**'}).as('saveSettings');
    cy.intercept({method: 'POST', url: '**/api/settings/**'}).as('saveSettings2');
    this.getSaveBtn().should('be.visible').click();
    cy.wait(['@saveSettings', '@saveSettings2'], { timeout: 30000 }).then(() => cy.log('Settings saved'));
  }

  // Site header elements
  getSiteHeaderMainText() {
    return cy.get('#main-header-text');
  }

  getSiteHeaderSecondaryText() {
    return cy.get('#secondary-header-text');
  }

  getSiteHeaderImage() {
    return cy.get('#site-header-image');
  }

  // Login Page Settings
  LoginPage = {
    getMainTextInput: () => cy.get('#mainTextLoginPage'),
    getSecondaryTextInput: () => cy.get('#secondaryTextLoginPage'),
    getImageUploadBtn: () => cy.get('#loginPageImageUploadBtn'),
    getMainTextVisibilityToggleBtn: () => cy.get('#loginPageMainTextVisibilityToggler'),
    getSecondaryTextVisibilityToggleBtn: () => cy.get('#loginPageSecondaryTextVisibilityToggler'),
    getImageVisibilityToggler: () => cy.get('#loginPageImageVisibilityToggler'),
    getResetBtn: () => cy.get('#loginPageReset'),
    
    reset: () => {
      cy.intercept('POST', '**/api/settings/reset-login-page').as('resetLoginPage');
      cy.get('#loginPageReset').should('be.visible').should('be.enabled').click();
      cy.wait('@resetLoginPage', { timeout: 30000 });
    }
  };

  // Site Header Settings
  SiteHeader = {
    getMainTextInput: () => cy.get('#headerSettingsMainText'),
    getSecondaryTextInput: () => cy.get('#headerSettingsSecondaryText'),
    getImageUploadBtn: () => cy.get('#siteHeaderUploadBtn'),
    getMainTextVisibilityToggleBtn: () => cy.get('#siteHeaderMainTextToggler'),
    getSecondaryTextVisibilityToggleBtn: () => cy.get('#siteHeaderSecondaryTextToggler'),
    getImageVisibilityToggler: () => cy.get('#siteHeaderImageVisibilityToggler'),
    getResetBtn: () => cy.get('#siteHeaderReset'),
    
    reset: () => {
      cy.intercept('POST', '**/api/settings/reset-page-header').as('resetHeader');
      cy.get('#siteHeaderReset').should('be.visible').should('be.enabled').click();
      cy.wait('@resetHeader', { timeout: 30000 });
    }
  };
}

const applicationSettingsPage = new ApplicationSettings();
export default applicationSettingsPage;
