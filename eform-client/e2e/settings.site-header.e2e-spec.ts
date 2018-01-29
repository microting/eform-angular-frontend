///<reference path="Page objects/LoginPage.ts"/>
import {browser, by, element, ExpectedConditions, $} from 'protractor';
import {default as data} from './data';
import {SettingsPage} from './Page objects/SettingsPage';
import {LoginPage} from './Page objects/LoginPage';
import {MainPage} from './Page objects/MainPage';

const loginPage: LoginPage = new LoginPage();
const mainPage: MainPage = new MainPage();
const settingsPage: SettingsPage = new SettingsPage();


beforeAll((done) => {
  browser.get('/');
  loginPage.usernameInput.sendKeys(data.login);
  loginPage.passwordInput.sendKeys(data.password);
  loginPage.loginButton.click();
  mainPage.advancedButton.click();
  mainPage.settingsButton.click();
  done();
});

describe('Reset button in Settings', function () {

  beforeAll(function (done) {
    settingsPage.SiteHeader.resetButton.click();
    browser.refresh();
    done();
  });

  it('should reset image', function (done) {

    /*const isExit: Boolean = */
    expect(browser.isElementPresent(settingsPage.headerImageMatcher))
      .toBeTruthy();
    /*if (isExit) {
      browser.driver.close().then(function () {
        process.exit(1);
      });
    }*/
    done();
  });
  it('should reset header main text', function (done) {
    /*const isExit: Boolean =*/
    expect(browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeTruthy();
    expect(settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerMainText);
    /*if (isExit) {
      browser.driver.close().then(function () {
        process.exit(1);
      });
    }*/
    done();
  });
  it('should reset header secondary text', function (done) {
    /*const isExit: Boolean = */
    expect(browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeTruthy();
    expect(settingsPage.headerSecondaryText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerSecondaryText);
    /*if (isExit) {
      browser.driver.close().then(function () {
        process.exit(1);
      });
    }*/
    done();
  });
});

describe('Settings in Site header section', () => {

  afterEach((done) => {
    settingsPage.SiteHeader.resetAndRefresh();
    done();
  });

  it('should hide logo in header', (done) => {

    expect(element(settingsPage.headerImageMatcher).isDisplayed()).toBeTruthy();
    settingsPage.SiteHeader.headerImageHideButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.headerImageMatcher)).toBeFalsy();
    done();
  });

  it('should change Main text in header', function (done) {
    settingsPage.SiteHeader.mainTextInput.clear();
    settingsPage.SiteHeader.mainTextInput.sendKeys(data.SiteHeaderSettings.customSettings.mainTextSample);
    settingsPage.saveAndRefresh();
    expect(settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.customSettings.mainTextSample);
    done();
  });

  it('should change secondary text', function (done) {
    settingsPage.SiteHeader.secondaryTextInput.clear();
    settingsPage.SiteHeader.secondaryTextInput.sendKeys(data.SiteHeaderSettings.customSettings.secondaryTextSample);
    settingsPage.saveAndRefresh();
    expect(settingsPage.headerSecondaryText.getText()).toEqual(data.SiteHeaderSettings.customSettings.secondaryTextSample);
    done();
  });

  it('should hide main text', function (done) {
    settingsPage.SiteHeader.hideMainTextButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeFalsy();
    done();
  });

  it('should hide secodary text', function (done) {
    settingsPage.SiteHeader.hideSecondaryTextButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeFalsy();
    done();
  });

  xit('should be able to change logo file', function () {
    // Will be implemented soon
  });

});
