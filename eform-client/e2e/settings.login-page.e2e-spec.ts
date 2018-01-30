import {LoginPage} from './Page objects/LoginPage';
import {SettingsPage} from './Page objects/SettingsPage';
import {MainPage} from './Page objects/MainPage';
import {default as data} from './data';
import {browser} from 'protractor';

const loginPage: LoginPage = new LoginPage();
const settingsPage: SettingsPage = new SettingsPage();
const mainPage: MainPage = new MainPage();


// testing reset button
describe('Reset button in login page section of Settings', function () {
  // refresh and get back to login page by signing out
  beforeAll(function (done) {
    browser.get('/');
    loginPage.login();
    mainPage.advancedButton.click();
    mainPage.settingsButton.click();
    settingsPage.LoginPage.resetButton.click();
    browser.refresh();
    settingsPage.signOut();
    done();
  });
// get back to settings page by logging in, clicking Advanced -> Settings
  afterAll(function (done) {
    loginPage.login();
    mainPage.advancedButton.click();
    mainPage.settingsButton.click();
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
});

// testing login page section of settings
xdescribe('Settings in Login Page section', () => {
// reset in login page section and refresh page after each test case
  afterEach((done) => {
    loginPage.login();
    mainPage.advancedButton.click();
    mainPage.settingsButton.click();
    done();
  });

  it('should hide logo in header', (done) => {
    settingsPage.LoginPage.loginPageImageHideButton.click();
    settingsPage.saveAndRefresh();
    settingsPage.signOut();
    expect(browser.isElementPresent(loginPage.loginPageImageMatcher)).toBeTruthy();
    done();
  });

  it('should change Main text in header', function (done) {
    done();
  });

  it('should change secondary text', function (done) {
    done();
  });

  it('should hide main text', function (done) {
    done();
  });

  it('should hide secodary text', function (done) {
    done();
  });

  xit('should be able to change logo file', function () {
    // Will be implemented soon
  });

});


