import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';
import { expect } from 'chai';

describe('Application settings page - site header section', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('should change main text', async () => {
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextInput()).setValue(
      ApplicationSettingsConstants.LoginPage.customMainText
    );
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await $('#username')).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.mainText()).getText(),
      'Error while changing main text on login page'
    ).to.equal(ApplicationSettingsConstants.LoginPage.customMainText);
  });
  it('should change secondary text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    //await loginPage.open('/application-settings');
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextInput()).setValue(
      ApplicationSettingsConstants.LoginPage.customSecondaryText
    );
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    // browser.pause(8000);
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await $('#username')).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.secondaryText()).getText(),
      'Error while changing secondary text on login page'
    ).to.equal(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });
  it('should hide main text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn()).click();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    // browser.pause(8000);
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await $('#username')).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.mainText()).isDisplayed(),
      'Error while toggling visibility of main text on login page'
    ).to.equal(false);
  });
  it('should hide secondary text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn()).click();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await $('#username')).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.secondaryText()).isDisplayed(),
      'Error while toggling visibility of secondary text on login page'
    ).to.equal(false);
  });
  it('should hide image', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.imageVisibilityToggler()).click();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await browser.pause(1000);
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.image()).isDisplayed(),
      'Error while toggling visibility of image on login page'
    ).to.equal(false);
  });
  it('should reset main text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await applicationSettingsPage.LoginPage.reset();
    await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isDisplayed()).equal(true);
    expect(
      await (await loginPage.mainText()).getText(),
      'Error while resetting main text on login page'
    ).to.equal(ApplicationSettingsConstants.LoginPage.originalMainText);
  });
  // it('should reset secondary text', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).getText(),
  //     'Error while resetting secondary text on login page'
  //   ).to.equal(ApplicationSettingsConstants.LoginPage.originalSecondaryText);
  // });
  // it('should reset main text visibility', async () => {
  //   expect(
  //     await (await loginPage.mainText()).isDisplayed(),
  //     'Error while refreshing visibility of main text on login page'
  //   ).to.equal(true);
  // });
  // it('should reset secondary text visibility', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).isDisplayed(),
  //     'Error while refreshing visibility of secondary text on login page'
  //   ).to.equal(true);
  // });
  // it('should reset image visibility', async () => {
  //   expect(
  //     await (await loginPage.image()).isDisplayed(),
  //     'Error while refreshing visibility of image on login page'
  //   ).to.equal(true);
  // });
});
