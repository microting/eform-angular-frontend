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
    browser.waitForVisible('#mainTextLoginPage', 120000);
    browser.pause(40000);
    applicationSettingsPage.SiteHeader.mainTextInput.setValue(ApplicationSettingsConstants.SiteHeader.customMainText);
    applicationSettingsPage.save();
    browser.refresh();
    browser.waitForVisible('#sign-out-dropdown', 120000);
    browser.pause(40000);
    expect(applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while editing site header main text').equal(ApplicationSettingsConstants.SiteHeader.customMainText);
  });
  it('should change secondary text', function () {
    applicationSettingsPage.SiteHeader.secondaryTextInput.setValue(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(1000);
    browser.waitForVisible('#sign-out-dropdown', 20000);
    expect(applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while editing site header secondary text').equal(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
  });
  it('should hide main text', function () {
    applicationSettingsPage.SiteHeader.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(1000);
    browser.waitForVisible('#sign-out-dropdown', 20000);
    expect(applicationSettingsPage.siteHeaderMainText.isVisible(),
      'Error while hiding site header main text').equal(false);
  });
  it('should hide secondary text', function () {
    applicationSettingsPage.SiteHeader.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(1000);
    browser.waitForVisible('#sign-out-dropdown', 20000);
    expect(applicationSettingsPage.siteHeaderSecondaryText.isVisible(),
      'Error while hiding site header secondary text').equal(false);
  });
  it('should hide image', function () {
    applicationSettingsPage.SiteHeader.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(1000);
    browser.waitForVisible('#sign-out-dropdown', 20000);
    expect(applicationSettingsPage.siteHeaderImage.isVisible(),
      'Error while hiding site header image').equal(false);
  });
  it('should reset site header main text', function () {
    applicationSettingsPage.SiteHeader.reset();
    expect(applicationSettingsPage.siteHeaderMainText.isVisible(),
      'Error while resetting site header main text').equal(true);
  });
  it('should reset site header secondary text', function () {
    expect(applicationSettingsPage.siteHeaderMainText.getText(),
      'Error while resetting site header secondary text').equal(ApplicationSettingsConstants.SiteHeader.originalMainText);
  });
  it('should reset site header main text visibility', function () {
    expect(applicationSettingsPage.siteHeaderSecondaryText.isVisible(),
      'Error while resetting site header main text visibility').equal(true);
  });
  it('should reset site header secondary text visibility', function () {
    expect(applicationSettingsPage.siteHeaderSecondaryText.getText(),
      'Error while resetting site header secondary text visibility').equal(ApplicationSettingsConstants.SiteHeader.originalSecondaryText);
  });
  it('should reset site header image text visibility', function () {
    expect(applicationSettingsPage.siteHeaderImage.isVisible(),
      'Error while resetting site header image visibility').equal(true);
  });
});
