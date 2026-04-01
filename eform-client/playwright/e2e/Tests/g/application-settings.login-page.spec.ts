import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { ApplicationSettingsPage } from '../../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../../Constants/ApplicationSettingsConstants';

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
    await (await applicationSettingsPage.LoginPage.mainTextInput()).waitFor({ state: 'visible', timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextInput()).fill(
      ApplicationSettingsConstants.LoginPage.customMainText
    );
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitFor({ state: 'visible', timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).textContent()
    ).toBe(ApplicationSettingsConstants.LoginPage.customMainText);
  });

  test('should change secondary text', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.secondaryTextInput()).waitFor({ state: 'visible', timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextInput()).fill(
      ApplicationSettingsConstants.LoginPage.customSecondaryText
    );
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitFor({ state: 'visible', timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.secondaryText()).textContent()
    ).toBe(ApplicationSettingsConstants.LoginPage.customSecondaryText);
  });

  test('should hide main text', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn()).waitFor({ state: 'visible', timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.mainTextVisibilityToggleBtn()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitFor({ state: 'visible', timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).isVisible()
    ).toBe(false);
  });

  test('should hide secondary text', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn()).waitFor({ state: 'visible', timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.secondaryTextVisibilityToggleBtn()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.Navbar.logout();
    await (await loginPage.usernameInput()).waitFor({ state: 'visible', timeout: 40000 });
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.secondaryText()).isVisible()
    ).toBe(false);
  });

  test('should hide image', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.LoginPage.imageVisibilityToggler()).waitFor({ state: 'visible', timeout: 240000 });
    await (await applicationSettingsPage.LoginPage.imageVisibilityToggler()).click();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await applicationSettingsPage.save();
    await (await myEformsPage.Navbar.signOutDropdown()).waitFor({ state: 'visible', timeout: 40000 });
    await page.waitForTimeout(1000);
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.image()).isVisible()
    ).toBe(false);
  });

  test('should reset main text', async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide(40000);
    await (await applicationSettingsPage.SiteHeader.mainTextInput()).waitFor({ state: 'visible', timeout: 240000 });
    await applicationSettingsPage.LoginPage.reset();
    await (await applicationSettingsPage.SiteHeader.mainTextInput()).waitFor({ state: 'visible', timeout: 240000 });
    await applicationSettingsPage.Navbar.logout();
    expect(await (await loginPage.loginBtn()).isVisible()).toBeTruthy();
    expect(
      await (await loginPage.mainText()).textContent()
    ).toBe(ApplicationSettingsConstants.LoginPage.originalMainText);
  });

  // test('should reset secondary text', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).textContent()
  //   ).toBe(ApplicationSettingsConstants.LoginPage.originalSecondaryText);
  // });
  // test('should reset main text visibility', async () => {
  //   expect(
  //     await (await loginPage.mainText()).isVisible()
  //   ).toBeTruthy();
  // });
  // test('should reset secondary text visibility', async () => {
  //   expect(
  //     await (await loginPage.secondaryText()).isVisible()
  //   ).toBeTruthy();
  // });
  // test('should reset image visibility', async () => {
  //   expect(
  //     await (await loginPage.image()).isVisible()
  //   ).toBeTruthy();
  // });
});
