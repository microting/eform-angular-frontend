import {LoginPage} from '../Page objects/LoginPage';
import {SettingsPage} from '../Page objects/SettingsPage';
import {Navbar} from '../Page objects/Navbar';
import {default as data} from '../data';
import {browser} from 'protractor';
import {signOut} from '../Helper methods/other-helper-methods';
import {goToSettingsPage} from '../Helper methods/go-to-pages';

const loginPage: LoginPage = new LoginPage();
const settingsPage: SettingsPage = new SettingsPage();
const navbar: Navbar = new Navbar();


describe('Login page settings tests', function () {
  afterAll(done => {
    signOut();
    done();
  });

  // testing reset button
  describe('Reset button in login page section of Settings', function () {

    beforeAll(function (done) {
      goToSettingsPage();
      settingsPage.LoginPage.resetButton.click();
      browser.refresh();
      signOut();
      done();
    });
    it('should reset login page image', function (done) {
      expect(browser.isElementPresent(loginPage.loginPageImageMatcher))
        .toBeTruthy();
      done();
    });
    it('should reset login page main text', function (done) {
      expect(browser.isElementPresent(loginPage.loginPageMainTextMatcher)).toBeTruthy();
      expect(loginPage.loginPageMainText.getText())
        .toEqual(data.LoginPageSettings.defaultSettings.loginPageMainText);
      done();
    });
    it('should reset login page secondary text', function (done) {
      expect(browser.isElementPresent(loginPage.loginPageSecondaryTextMatcher)).toBeTruthy();
      expect(loginPage.loginPageSecondaryText.getText())
        .toEqual(data.LoginPageSettings.defaultSettings.loginPageSecondaryText);
      done();
    });
    // get back to settings page by logging in, clicking Advanced -> Settings
    afterAll(function (done) {
      goToSettingsPage();
      done();
    });
  });

// testing login page section of settings
  describe('Settings in Login Page section', () => {

// reset in login page section and refresh page after each test case
    afterEach((done) => {
      goToSettingsPage();
      done();
    });

    it('should hide logo in header', (done) => {
      settingsPage.LoginPage.loginPageImageHideButton.click();
      settingsPage.saveAndRefresh();
      signOut();
      expect(browser.isElementPresent(loginPage.loginPageImageMatcher)).toBeFalsy();
      done();
    });

    it('should change Main text in header', function (done) {
      settingsPage.LoginPage.mainTextInput.clear();
      settingsPage.LoginPage.mainTextInput.sendKeys(data.LoginPageSettings.customSettings.loginPageMainTextSample);
      settingsPage.saveAndRefresh();
      signOut();
      expect(loginPage.loginPageMainText.getText()).toEqual(data.LoginPageSettings.customSettings.loginPageMainTextSample);
      done();
    });

    it('should change secondary text', function (done) {
      settingsPage.LoginPage.secondaryTextInput.clear();
      settingsPage.LoginPage.secondaryTextInput.sendKeys(data.LoginPageSettings.customSettings.loginPageSecondaryTextSample);
      settingsPage.saveAndRefresh();
      signOut();
      expect(loginPage.loginPageSecondaryText.getText()).toEqual(data.LoginPageSettings.customSettings.loginPageSecondaryTextSample);
      done();
    });

    it('should hide main text', function (done) {
      settingsPage.LoginPage.mainTextHideButton.click();
      settingsPage.saveAndRefresh();
      signOut();
      expect(browser.isElementPresent(loginPage.loginPageMainText)).toBeFalsy();
      done();
    });

    it('should hide secodary text', function (done) {
      settingsPage.LoginPage.secondaryTextHideButton.click();
      settingsPage.saveAndRefresh();
      signOut();
      expect(browser.isElementPresent(loginPage.loginPageSecondaryText)).toBeFalsy();
      done();
    });

    xit('should be able to change logo file', function () {
      // Will be implemented as soon as image comparison tool is found
    });

  });

});




