import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { PasswordSettingsPage } from '../../Page objects/PasswordSettings.page';

test.describe('Password settings', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let passwordSettings: PasswordSettingsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    passwordSettings = new PasswordSettingsPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToPasswordSettings();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should set password to 2Times2WillDo', async () => {
    await passwordSettings.setNewPassword();
    await passwordSettings.Navbar.logout();
    await loginPage.open('/');
    await loginPage.loginWithNewPassword();
    await myEformsPage.Navbar.goToPasswordSettings();
  });

  test('should revert to old password', async () => {
    await passwordSettings.revertToOldPassword();
    await passwordSettings.Navbar.logout();
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToPasswordSettings();
  });
});
