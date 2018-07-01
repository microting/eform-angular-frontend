import {LoginPage} from '../../Page objects/LoginPage';
import {SettingsPage} from '../../Page objects/SettingsPage';
import {Navbar} from '../../Page objects/Navbar';
import {default as data} from '../../data';
import {browser} from 'protractor';
import {signOut} from '../../Helper methods/other-helper-methods';
import {goToSettingsPage} from '../../Helper methods/go-to-pages';

const loginPage: LoginPage = new LoginPage();
const settingsPage: SettingsPage = new SettingsPage();


describe('Login page settings tests', async () => {
  afterAll(async () => {
    await signOut();
  });
  beforeAll(async () => {
    await goToSettingsPage();
    await settingsPage.LoginPage.resetButton.click();
    await browser.waitForAngular();
    await browser.refresh();
    await signOut();
  });

  // testing reset button
  describe('Reset button in login page section of Settings', function () {
    beforeEach(async () => {
      await browser.waitForAngular();
    });
    afterAll(async () => {
      await goToSettingsPage();
    });
    it('should reset login page image', async () => {
      expect(await browser.isElementPresent(loginPage.loginPageImageMatcher))
        .toBeTruthy();
    });
    it('should reset login page main text', async () => {
      expect(await browser.isElementPresent(loginPage.loginPageMainTextMatcher)).toBeTruthy();
      expect(await loginPage.loginPageMainText.getText())
        .toEqual(data.LoginPageSettings.defaultSettings.loginPageMainText);
    });
    it('should reset login page secondary text', async () => {
      expect(await browser.isElementPresent(loginPage.loginPageSecondaryTextMatcher)).toBeTruthy();
      expect(await loginPage.loginPageSecondaryText.getText())
        .toEqual(data.LoginPageSettings.defaultSettings.loginPageSecondaryText);
    });
  });

// testing login page section of settings
  describe('Settings in Login Page section', () => {
// reset in login page section and refresh page after each test case
    afterEach(async () => {
      await goToSettingsPage();
    });
    beforeEach(async () => {
      await browser.waitForAngular();
      await  browser.sleep(5000);
    });

    it('should hide logo in header', async () => {
      await settingsPage.LoginPage.loginPageImageHideButton.click();
      await settingsPage.saveAndRefresh();
      await signOut();
      expect(await browser.isElementPresent(loginPage.loginPageImageMatcher)).toBeFalsy();
    });

    it('should change Main text in header', async () => {
      await settingsPage.LoginPage.mainTextInput.clear();
      await settingsPage.LoginPage.mainTextInput.sendKeys(data.LoginPageSettings.customSettings.loginPageMainTextSample);
      await settingsPage.saveAndRefresh();
      await signOut();
      expect(await loginPage.loginPageMainText.getText()).toEqual(data.LoginPageSettings.customSettings.loginPageMainTextSample);
    });

    it('should change secondary text', async () => {
      await settingsPage.LoginPage.secondaryTextInput.clear();
      await settingsPage.LoginPage.secondaryTextInput.sendKeys(data.LoginPageSettings.customSettings.loginPageSecondaryTextSample);
      await settingsPage.saveAndRefresh();
      await signOut();
      expect(await loginPage.loginPageSecondaryText.getText()).toEqual(data.LoginPageSettings.customSettings.loginPageSecondaryTextSample);
    });

    it('should hide main text', async () => {
      await settingsPage.LoginPage.mainTextHideButton.click();
      await settingsPage.saveAndRefresh();
      await signOut();
      expect(await browser.isElementPresent(loginPage.loginPageMainText)).toBeFalsy();
    });

    it('should hide secodary text', async () => {
      await settingsPage.LoginPage.secondaryTextHideButton.click();
      await settingsPage.saveAndRefresh();
      await signOut();
      expect(await browser.isElementPresent(loginPage.loginPageSecondaryText)).toBeFalsy();
    });

    xit('should be able to change logo file', function () {
      // Will be implemented as soon as image comparison tool is found
    });

  });

});




