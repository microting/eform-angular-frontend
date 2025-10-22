import { PageWithNavbarPage } from './PageWithNavbar.page';

class ProfileSettingsPage extends PageWithNavbarPage {
  languageSelector() {
    return cy.get('#ProfileLanguageSelector');
  }

  saveBtn() {
    return cy.get('#ProfileSettingsSaveBtn');
  }

  saveProfileSettings() {
    cy.intercept('PUT', '**/api/user-settings').as('updateUserSettings');
    this.saveBtn().should('be.visible').should('be.enabled').click();
    cy.wait('@updateUserSettings', { timeout: 10000 });
    cy.get('#spinner-animation').should('not.exist');
    cy.wait(500);
  }

  chooseLanguage(language: string) {
    this.languageSelector().should('be.visible').click();
    cy.wait(500);
    // The language selector is a custom mtx-select, we need to click on the option
    cy.contains('.mtx-option', language).should('be.visible').click();
    cy.wait(500);
  }
}

const profileSettingsPage = new ProfileSettingsPage();
export default profileSettingsPage;
