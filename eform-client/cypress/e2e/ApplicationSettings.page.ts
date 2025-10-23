import { Navbar } from './Navbar.page';

export class ApplicationSettings {
  public Navbar = new Navbar();

  // Save button
  getSaveBtn() {
    return cy.get('#applicationSettingsSaveBtn');
  }

  save() {
    this.getSaveBtn().should('be.visible').click();
    cy.wait(500);
    cy.get('#spinner-animation').should('not.exist');
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
      cy.get('#loginPageReset').should('be.visible').should('be.enabled').click();
      cy.get('#spinner-animation').should('not.exist');
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
      cy.get('#siteHeaderReset').should('be.visible').should('be.enabled').click();
      cy.get('#spinner-animation').should('not.exist');
    }
  };
}

const applicationSettingsPage = new ApplicationSettings();
export default applicationSettingsPage;
