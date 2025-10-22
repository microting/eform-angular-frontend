import loginPage from '../Login.page';
import profileSettingsPage from '../ProfileSettings.page';
import { expect } from 'chai';

const translationsEFormsPageEng: Array<{ selector: string; value: string }> = [
  { selector: 'eform-new-subheader h2', value: 'My eForms' },
];

const translationsEFormsPageDan: Array<{ selector: string; value: string }> = [
  { selector: 'eform-new-subheader h2', value: 'Mine eForms' },
];

describe('Profile Settings - Language', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });

  it('should set language to English', () => {
    // Navigate to profile settings
    profileSettingsPage.Navbar.goToProfileSettings();
    cy.get('#ProfileLanguageSelector').should('be.visible');

    // Choose English language
    profileSettingsPage.chooseLanguage('English');
    profileSettingsPage.saveProfileSettings();

    // Navigate to My eForms to verify language change
    profileSettingsPage.Navbar.goToMyEForms();
    cy.get('#newEFormBtn').should('be.visible');

    // Verify UI is in English
    for (const translation of translationsEFormsPageEng) {
      cy.get(translation.selector)
        .invoke('text')
        .then(text => {
          expect(text.trim()).to.equal(
            translation.value,
            `element with selector ${translation.selector} must be = ${translation.value}, but element text = ${text.trim()}. Language = English`
          );
        });
    }
  });

  it('should set language to Dansk', () => {
    // Navigate to profile settings
    profileSettingsPage.Navbar.goToProfileSettings();
    cy.get('#ProfileLanguageSelector').should('be.visible');

    // Choose Danish language
    profileSettingsPage.chooseLanguage('Dansk');
    profileSettingsPage.saveProfileSettings();

    // Navigate to My eForms to verify language change
    profileSettingsPage.Navbar.goToMyEForms();
    cy.get('#newEFormBtn').should('be.visible');

    // Verify UI is in Danish
    for (const translation of translationsEFormsPageDan) {
      cy.get(translation.selector)
        .invoke('text')
        .then(text => {
          expect(text.trim()).to.equal(
            translation.value,
            `element with selector ${translation.selector} must be = ${translation.value}, but element text = ${text.trim()}. Language = Dansk`
          );
        });
    }
  });

  after(() => {
    // Reset to English after tests
    profileSettingsPage.Navbar.goToProfileSettings();
    cy.get('#ProfileLanguageSelector').should('be.visible');
    profileSettingsPage.chooseLanguage('English');
    profileSettingsPage.saveProfileSettings();
  });
});
