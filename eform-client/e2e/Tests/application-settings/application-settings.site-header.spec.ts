import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import applicationSettingsPage from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';

const expect = require('chai').expect;

describe('Application settings page - site header section', function () {
  before('Login', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  // it('should change main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await (await $('#mainTextLoginPage')).waitForDisplayed({ timeout: 240000 });
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   await (await applicationSettingsPage.SiteHeader.mainTextInput()).setValue(
  //     ApplicationSettingsConstants.SiteHeader.customMainText
  //   );
  //   await applicationSettingsPage.save();
  //   await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 240000 });
  //   (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).getText(),
  //     'Error while editing site header main text'
  //   ).equal(ApplicationSettingsConstants.SiteHeader.customMainText);
  // });
  // it('should change secondary text', async () => {
  //   await (await applicationSettingsPage.SiteHeader.secondaryTextInput()).setValue(
  //     ApplicationSettingsConstants.SiteHeader.customSecondaryText
  //   );
  //   await applicationSettingsPage.save();
  //   await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).getText(),
  //     'Error while editing site header secondary text'
  //   ).equal(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
  // });
  // it('should hide main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await (await applicationSettingsPage.SiteHeader.mainTextVisibilityToggleBtn()).click();
  //   await applicationSettingsPage.save();
  //   await loginPage.open('/application-settings');
  //   await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   await loginPage.open('/');
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).isDisplayed(),
  //     'Error while hiding site header main text'
  //   ).equal(false);
  // });
  // it('should hide secondary text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await (await applicationSettingsPage.SiteHeader.secondaryTextVisibilityToggleBtn()).click();
  //   await applicationSettingsPage.save();
  //   await loginPage.open('/application-settings');
  //   await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   await loginPage.open('/');
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).isDisplayed(),
  //     'Error while hiding site header secondary text'
  //   ).equal(false);
  // });
  it('should hide image', async () => {
    await myEformsPage.Navbar.goToApplicationSettings();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await (await applicationSettingsPage.SiteHeader.imageVisibilityToggler()).click();
    await applicationSettingsPage.save();
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await loginPage.open('/application-settings');
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await loginPage.open('/');
    expect(
      await (await applicationSettingsPage.siteHeaderImage()).isDisplayed(),
      'Error while hiding site header image'
    ).equal(false);
  });
  // it('should reset site header main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await applicationSettingsPage.SiteHeader.reset();
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   await loginPage.open('/application-settings');
  //   await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).isDisplayed(),
  //     'Error while resetting site header main text'
  //   ).equal(true);
  // });
  // it('should reset site header secondary text', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).getText(),
  //     'Error while resetting site header secondary text'
  //   ).equal(ApplicationSettingsConstants.SiteHeader.originalMainText);
  // });
  // it('should reset site header main text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).isDisplayed(),
  //     'Error while resetting site header main text visibility'
  //   ).equal(true);
  // });
  // it('should reset site header secondary text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).getText(),
  //     'Error while resetting site header secondary text visibility'
  //   ).equal(ApplicationSettingsConstants.SiteHeader.originalSecondaryText);
  // });
  // it('should reset site header image text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderImage()).isDisplayed(),
  //     'Error while resetting site header image visibility'
  //   ).equal(true);
  // });
});
