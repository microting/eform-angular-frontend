import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';
import {expect} from 'chai';

describe('Application settings page - site header section', function () {
  before(function () {
    loginPage.open('/auth');
  });
  it('should change main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.mainTextInput.setValue(ApplicationSettingsConstants.LoginPage.customMainText);
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(10000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.mainText.getText(),
      'Error while changing main text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customMainText);
  });
  it('should change secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.secondaryTextInput.setValue(ApplicationSettingsConstants.LoginPage.customSecondaryText);
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(8000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.secondaryText.getText(),
      'Error while changing secondary text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });
  it('should hide main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(8000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.mainText.isVisible(),
      'Error while toggling visibility of main text on login page').to.equal(false);
  });
  it('should hide secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(8000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.secondaryText.isVisible(),
      'Error while toggling visibility of secondary text on login page').to.equal(false);
  });
  it('should hide image', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    browser.refresh();
    browser.pause(8000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.image.isVisible(),
      'Error while toggling visibility of image on login page').to.equal(false);
  });
  it('should reset main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.reset();
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isVisible()).equal(true);
    expect(loginPage.mainText.getText(),
      'Error while resetting main text on login page').to.equal(ApplicationSettingsConstants.LoginPage.originalMainText);
  });
  it('should reset secondary text', function () {
    expect(loginPage.secondaryText.getText(),
      'Error while resetting secondary text on login page').to.equal(ApplicationSettingsConstants.LoginPage.originalSecondaryText);
  });
  it('should reset main text visibility', function () {
    expect(loginPage.mainText.isVisible(),
      'Error while refreshing visibility of main text on login page').to.equal(true);
  });
  it('should reset secondary text visibility', function () {
    expect(loginPage.secondaryText.isVisible(),
      'Error while refreshing visibility of secondary text on login page').to.equal(true);
  });
  it('should reset image visibility', function () {
    expect(loginPage.image.isVisible(),
      'Error while refreshing visibility of image on login page').to.equal(true);
  });
});
