import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';
import {expect} from 'chai';

describe('Application settings page - site header section', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should change main text', function () {
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.mainTextInput.setValue(ApplicationSettingsConstants.LoginPage.customMainText);
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.save();
    $('#sign-out-dropdown').waitForDisplayed({timeout: 40000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed({timeout: 20000});
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.mainText.getText(),
      'Error while changing main text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customMainText);
  });
  it('should change secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.secondaryTextInput.setValue(ApplicationSettingsConstants.LoginPage.customSecondaryText);
    applicationSettingsPage.save();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed({timeout: 20000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed({timeout: 20000});
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.secondaryText.getText(),
      'Error while changing secondary text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });
  it('should hide main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed({timeout: 20000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed({timeout: 20000});
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.mainText.isDisplayed(),
      'Error while toggling visibility of main text on login page').to.equal(false);
  });
  it('should hide secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    $('#sign-out-dropdown').waitForDisplayed({timeout: 20000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed({timeout: 20000});
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.secondaryText.isDisplayed(),
      'Error while toggling visibility of secondary text on login page').to.equal(false);
  });
  it('should hide image', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    $('#sign-out-dropdown').waitForDisplayed({timeout: 20000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    browser.pause(1000);
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.image.isDisplayed(),
      'Error while toggling visibility of image on login page').to.equal(false);
  });
  it('should reset main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    $('#mainTextLoginPage').waitForDisplayed({timeout: 120000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    applicationSettingsPage.LoginPage.reset();
    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.mainText.getText(),
      'Error while resetting main text on login page').to.equal(ApplicationSettingsConstants.LoginPage.originalMainText);
  });
  it('should reset secondary text', function () {
    expect(loginPage.secondaryText.getText(),
      'Error while resetting secondary text on login page').to.equal(ApplicationSettingsConstants.LoginPage.originalSecondaryText);
  });
  it('should reset main text visibility', function () {
    expect(loginPage.mainText.isDisplayed(),
      'Error while refreshing visibility of main text on login page').to.equal(true);
  });
  it('should reset secondary text visibility', function () {
    expect(loginPage.secondaryText.isDisplayed(),
      'Error while refreshing visibility of secondary text on login page').to.equal(true);
  });
  it('should reset image visibility', function () {
    expect(loginPage.image.isDisplayed(),
      'Error while refreshing visibility of image on login page').to.equal(true);
  });
});
