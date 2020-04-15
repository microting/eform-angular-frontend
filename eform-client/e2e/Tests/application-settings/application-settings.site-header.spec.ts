import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';

const expect = require('chai').expect;

describe('Application settings page - site header section', function () {
  before('Login', function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should change main text', function () {
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed(120000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.SiteHeader.mainTextInput.setValue(ApplicationSettingsConstants.SiteHeader.customMainText);
    applicationSettingsPage.save();
    //browser.refresh();
    $('#sign-out-dropdown').waitForDisplayed(120000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    expect(applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while editing site header main text').equal(ApplicationSettingsConstants.SiteHeader.customMainText);
  });
  it('should change secondary text', function () {
    applicationSettingsPage.SiteHeader.secondaryTextInput.setValue(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
    applicationSettingsPage.save();
    //browser.refresh();
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    expect(applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while editing site header secondary text').equal(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
  });
  it('should hide main text', function () {
    applicationSettingsPage.SiteHeader.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    loginPage.open('/');
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    expect(applicationSettingsPage.siteHeaderMainText.isDisplayed(),
      'Error while hiding site header main text').equal(false);
  });
  it('should hide secondary text', function () {
    applicationSettingsPage.SiteHeader.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    loginPage.open('/');
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    expect(applicationSettingsPage.siteHeaderSecondaryText.isDisplayed(),
      'Error while hiding site header secondary text').equal(false);
  });
  it('should hide image', function () {
    applicationSettingsPage.SiteHeader.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    loginPage.open('/application-settings');
    $('#spinner-animation').waitForDisplayed(50000, true);
    loginPage.open('/');
    $('#sign-out-dropdown').waitForDisplayed(20000);
    expect(applicationSettingsPage.siteHeaderImage.isDisplayed(),
      'Error while hiding site header image').equal(false);
  });
  it('should reset site header main text', function () {
    applicationSettingsPage.SiteHeader.reset();
    $('#spinner-animation').waitForDisplayed(50000, true);
    loginPage.open('/application-settings');
    $('#spinner-animation').waitForDisplayed(50000, true);
    expect(applicationSettingsPage.siteHeaderMainText.isDisplayed(),
      'Error while resetting site header main text').equal(true);
  });
  it('should reset site header secondary text', function () {
    expect(applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while resetting site header secondary text').equal(ApplicationSettingsConstants.SiteHeader.originalMainText);
  });
  it('should reset site header main text visibility', function () {
    expect(applicationSettingsPage.siteHeaderSecondaryText.isDisplayed(),
      'Error while resetting site header main text visibility').equal(true);
  });
  it('should reset site header secondary text visibility', function () {
    expect(applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while resetting site header secondary text visibility').equal(ApplicationSettingsConstants.SiteHeader.originalSecondaryText);
  });
  it('should reset site header image text visibility', function () {
    expect(applicationSettingsPage.siteHeaderImage.isDisplayed(),
      'Error while resetting site header image visibility').equal(true);
  });
});
