import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../helper-functions';

test.describe('Device users page', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let deviceUsersPage: DeviceUsersPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    // Create a device user for delete tests to use
    await deviceUsersPage.createNewDeviceUser(generateRandmString(), generateRandmString());
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should not delete if cancel was clicked', async () => {
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await page.locator('#deviceUserId-0').waitFor({ state: 'visible', timeout: 40000 });
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.openRowMenu();
    const index = lastDeviceUser.index - 1;
    const deleteBtn = page.locator(`#deleteDeviceUserBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    await deviceUsersPage.cancelDeleteBtn().click();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumAfterCancelDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete).toBe(rowNumAfterCancelDelete);
  });

  test('should delete user', async () => {
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await page.locator('#deviceUserId-0').waitFor({ state: 'visible', timeout: 40000 });
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.openRowMenu();
    const index = lastDeviceUser.index - 1;
    const deleteBtn = page.locator(`#deleteDeviceUserBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    await deviceUsersPage.saveDeleteBtn().click();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumAfterDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete).toBe(rowNumAfterDelete + 1);
  });
});
