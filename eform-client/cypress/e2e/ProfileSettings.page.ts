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
    // Click on the language selector
    this.languageSelector().should('be.visible').click();
    cy.wait(500);
    // Type the language name into the input field
    cy.get('#ProfileLanguageSelector input').type(language);
    cy.wait(200);
    // Press Enter to select the option
    cy.get('body').type('{enter}');
    cy.wait(500);
  }
}

const profileSettingsPage = new ProfileSettingsPage();
export default profileSettingsPage;
