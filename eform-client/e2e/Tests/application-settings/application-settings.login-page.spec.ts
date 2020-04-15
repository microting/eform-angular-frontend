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
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.LoginPage.mainTextInput.setValue(ApplicationSettingsConstants.LoginPage.customMainText);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.save();
    //browser.refresh();
    // browser.pause(10000);
    $('#sign-out-dropdown').waitForDisplayed(40000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed(60000);
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.mainText.getText(),
      'Error while changing main text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customMainText);
  });
  it('should change secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.secondaryTextInput.setValue(ApplicationSettingsConstants.LoginPage.customSecondaryText);
    applicationSettingsPage.save();
    //browser.refresh();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed(60000);
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.secondaryText.getText(),
      'Error while changing secondary text on login page').to.equal(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });
  it('should hide main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    //browser.refresh();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed(60000);
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.mainText.isDisplayed(),
      'Error while toggling visibility of main text on login page').to.equal(false);
  });
  it('should hide secondary text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn.click();
    applicationSettingsPage.save();
    //browser.refresh();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed(20000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    applicationSettingsPage.Navbar.logout();
    $('#username').waitForDisplayed(60000);
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.secondaryText.isDisplayed(),
      'Error while toggling visibility of secondary text on login page').to.equal(false);
  });
  it('should hide image', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
    applicationSettingsPage.LoginPage.imageVisibilityToggler.click();
    applicationSettingsPage.save();
    //browser.refresh();
    // browser.pause(8000);
    $('#sign-out-dropdown').waitForDisplayed(20000);
    browser.pause(1000);    applicationSettingsPage.Navbar.logout();
    expect(loginPage.loginBtn.isDisplayed()).equal(true);
    expect(loginPage.image.isDisplayed(),
      'Error while toggling visibility of image on login page').to.equal(false);
  });
  it('should reset main text', function () {
    loginPage.login();
    myEformsPage.Navbar.goToApplicationSettings();
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
