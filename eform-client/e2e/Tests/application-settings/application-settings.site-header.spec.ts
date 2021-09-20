import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';

const expect = require('chai').expect;

describe('Application settings page - site header section', function () {
  before('Login', async () => {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should change main text', async () => {
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({ timeout: 120000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    applicationSettingsPage.SiteHeader.mainTextInput.setValue(
      ApplicationSettingsConstants.SiteHeader.customMainText
    );
    applicationSettingsPage.save();
    $('#sign-out-dropdown').waitForDisplayed({ timeout: 120000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    expect(
      applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while editing site header main text'
    ).equal(ApplicationSettingsConstants.SiteHeader.customMainText);
  });
  it('should change secondary text', async () => {
    applicationSettingsPage.SiteHeader.secondaryTextInput.setValue(
      ApplicationSettingsConstants.SiteHeader.customSecondaryText
    );
    applicationSettingsPage.save();
    $('#sign-out-dropdown').waitForDisplayed({ timeout: 40000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    expect(
      applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while editing site header secondary text'
    ).equal(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
  });
  it('should hide main text', async () => {
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.SiteHeader.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    loginPage.open('/application-settings');
    $('#sign-out-dropdown').waitForDisplayed({ timeout: 40000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    loginPage.open('/');
    expect(
      applicationSettingsPage.siteHeaderMainText.isDisplayed(),
      'Error while hiding site header main text'
    ).equal(false);
  });
  it('should hide secondary text', async () => {
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.SiteHeader.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    loginPage.open('/application-settings');
    $('#sign-out-dropdown').waitForDisplayed({ timeout: 40000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    loginPage.open('/');
    expect(
      applicationSettingsPage.siteHeaderSecondaryText.isDisplayed(),
      'Error while hiding site header secondary text'
    ).equal(false);
  });
  it('should hide image', async () => {
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.SiteHeader.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    loginPage.open('/application-settings');
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    $('#sign-out-dropdown').waitForDisplayed({ timeout: 40000 });
    loginPage.open('/');
    expect(
      applicationSettingsPage.siteHeaderImage.isDisplayed(),
      'Error while hiding site header image'
    ).equal(false);
  });
  it('should reset site header main text', async () => {
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.SiteHeader.reset();
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    loginPage.open('/application-settings');
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    expect(
      applicationSettingsPage.siteHeaderMainText.isDisplayed(),
      'Error while resetting site header main text'
    ).equal(true);
  });
  it('should reset site header secondary text', async () => {
    expect(
      applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while resetting site header secondary text'
    ).equal(ApplicationSettingsConstants.SiteHeader.originalMainText);
  });
  it('should reset site header main text visibility', async () => {
    expect(
      applicationSettingsPage.siteHeaderSecondaryText.isDisplayed(),
      'Error while resetting site header main text visibility'
    ).equal(true);
  });
  it('should reset site header secondary text visibility', async () => {
    expect(
      applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while resetting site header secondary text visibility'
    ).equal(ApplicationSettingsConstants.SiteHeader.originalSecondaryText);
  });
  it('should reset site header image text visibility', async () => {
    expect(
      applicationSettingsPage.siteHeaderImage.isDisplayed(),
      'Error while resetting site header image visibility'
    ).equal(true);
  });
});
