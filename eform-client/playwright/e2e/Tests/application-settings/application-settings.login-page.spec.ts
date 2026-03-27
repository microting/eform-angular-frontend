import { test, expect } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { ApplicationSettingsPage } from '../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../Constants/ApplicationSettingsConstants';

test.describe('Application settings page - site header section', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let applicationSettingsPage: ApplicationSettingsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    applicationSettingsPage = new ApplicationSettingsPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should change main text', async () => {
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.mainTextInput()).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextInput()).setValue(
      ApplicationSettingsConstants.LoginPage.customMainText
    );
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).getText()
    ).toBe(ApplicationSettingsConstants.LoginPage.customMainText);
  });

  test('should change secondary text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.secondaryTextInput()).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextInput()).setValue(
      ApplicationSettingsConstants.LoginPage.customSecondaryText
    );
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.secondaryText()).getText()
    ).toBe(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });

  test('should hide main text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn()).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).isDisplayed()
    ).toBe(false);
  });

  test('should hide secondary text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn()).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitForDisplayed({ timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.secondaryText()).isDisplayed()
    ).toBe(false);
  });

  test('should hide image', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.imageVisibilityToggler()).waitForDisplayed({ timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.imageVisibilityToggler()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitForDisplayed({ timeout: 40000 });
    await page.waitForTimeout(1000);
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.image()).isDisplayed()
    ).toBe(false);
  });

  test('should reset main text', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.SiteHeader.mainTextInput()).waitForDisplayed({ timeout: 240000 });
    await applicationSettingsPage.LoginPage.reset();
    await (await applicationSettingsPage.SiteHeader.mainTextInput()).waitForDisplayed({ timeout: 240000 });
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).getText()
    ).toBe(ApplicationSettingsConstants.LoginPage.originalMainText);
  });

  // test('should reset secondary text', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).getText()
  //   ).toBe(ApplicationSettingsConstants.LoginPage.originalSecondaryText);
  // });
  // test('should reset main text visibility', async () => {
  //   expect(
  //     await (await loginPage.mainText()).isDisplayed()
  //   ).toBeTruthy();
  // });
  // test('should reset secondary text visibility', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).isDisplayed()
  //   ).toBeTruthy();
  // });
  // test('should reset image visibility', async () => {
  //   expect(
  //     await (await loginPage.image()).isDisplayed()
  //   ).toBeTruthy();
  // });
});
