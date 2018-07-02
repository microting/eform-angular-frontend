import {browser, element, ExpectedConditions} from 'protractor';
import {default as data} from '../../data';
import {SettingsPage} from '../../Page objects/SettingsPage';
import {LoginPage} from '../../Page objects/LoginPage';
import {DatabasePage} from '../../Page objects/DatabasePage';
import {signOut} from '../../Helper methods/other-helper-methods';
import {goToSettingsPage} from '../../Helper methods/go-to-pages';

const path = require('path');

const loginPage: LoginPage = new LoginPage();
const settingsPage: SettingsPage = new SettingsPage();
const databasePage: DatabasePage = new DatabasePage();

describe('Reset button in Site header section of Settings', function () {
  // Navigate to login page, then save db and reset header settings to make them default
  beforeAll(async function () {
    await browser.get('/');
    try {
      await databasePage.saveButton.isDisplayed();
      await databasePage.saveDatabase(); // enter needed info in inputs and press save
      await browser.wait(ExpectedConditions.visibilityOf(loginPage.loginButton));
    } catch (e) {
    }
    await goToSettingsPage();
    await settingsPage.SiteHeader.resetButton.click();
    await browser.refresh();
  });

  beforeEach(async () => {
    await browser.waitForAngular();
  });
  // check that everything reset fine
  it('should reset image', async function () {
    expect(await browser.isElementPresent(settingsPage.headerImageMatcher))
      .toBeTruthy();
  });
  it('should reset header main text', async function () {
    expect(await browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeTruthy();
    expect(await settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerMainText);
  });
  it('should reset header secondary text', async function () {
    expect(await browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeTruthy();
    expect(await settingsPage.headerSecondaryText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerSecondaryText);
  });
});

// Check changing texts
describe('Settings in Site header section', () => {

  beforeEach(async () => {
    await browser.waitForAngular();
  });
  afterAll(async () => {
    await signOut();
  });

  afterEach(async () => {
    await settingsPage.SiteHeader.resetAndRefresh();
  });

  it('should hide logo in header', async () => {
    expect(await element(settingsPage.headerImageMatcher).isDisplayed()).toBeTruthy();
    await settingsPage.SiteHeader.headerImageHideButton.click();
    await settingsPage.saveAndRefresh();
    expect(await browser.isElementPresent(settingsPage.headerImageMatcher)).toBeFalsy();
  });

  it('should change Main text in header', async () => {
    await settingsPage.SiteHeader.mainTextInput.clear();
    await settingsPage.SiteHeader.mainTextInput.sendKeys(data.SiteHeaderSettings.customSettings.mainTextSample);
    await settingsPage.saveAndRefresh();
    expect(await settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.customSettings.mainTextSample);
  });

  it('should change secondary text in header', async () => {
    await settingsPage.SiteHeader.secondaryTextInput.clear();
    await settingsPage.SiteHeader.secondaryTextInput.sendKeys(data.SiteHeaderSettings.customSettings.secondaryTextSample);
    await settingsPage.saveAndRefresh();
    expect(await settingsPage.headerSecondaryText.getText()).toEqual(data.SiteHeaderSettings.customSettings.secondaryTextSample);
  });

  it('should hide main text in header', async () => {
    await settingsPage.SiteHeader.hideMainTextButton.click();
    await settingsPage.saveAndRefresh();
    expect(await browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeFalsy();
  });

  it('should hide secodary text in header', async () => {
    await settingsPage.SiteHeader.hideSecondaryTextButton.click();
    await settingsPage.saveAndRefresh();
    expect(await browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeFalsy();
  });

  // This test will be completed as soon as tool for image comparison is found
  xit('should be able to change logo file', async function () {
    const fileToUpload = data.SiteHeaderSettings.customSettings.logoFilePath;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    settingsPage.SiteHeader.fileInput.sendKeys(absolutePath);
    await settingsPage.saveAndRefresh();
    expect((element(settingsPage.headerImageMatcher)).getAttribute('src'))
      .toEqual(absolutePath);
  });

});
