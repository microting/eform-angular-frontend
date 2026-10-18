import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';
import { Guid } from 'guid-typescript';

test.describe('Device users page', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let deviceUsersPage: DeviceUsersPage;
  const createdFirstNames: string[] = [];

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await deviceUsersPage
      .newDeviceUserBtn()
      .waitFor({ state: 'visible', timeout: 40000 });
    // This spec owns its fixtures. It used to rely on a device user being left behind
    // by device-users.add.spec, which cleans up after itself - so on a clean database
    // the grid was empty here and every row locator timed out.
    // Two rows: one for the cancel case, one the delete case actually removes.
    for (let i = 0; i < 2; i++) {
      const firstName = Guid.create().toString();
      createdFirstNames.push(firstName);
      await deviceUsersPage.createNewDeviceUser(
        firstName,
        Guid.create().toString()
      );
    }
  });

  test.afterAll(async () => {
    // Hand the grid back the way we found it: device-users.edit.spec runs next and
    // its per-row locators are strict, so leftover rows would break it.
    for (const firstName of createdFirstNames) {
      const row = await deviceUsersPage.getDeviceUserByName(firstName);
      if (row) {
        await row.delete();
      }
    }
    await page.close();
  });

  test('should not delete if cancel was clicked', async () => {
    await page
      .locator('#deviceUserId-0')
      .waitFor({ state: 'visible', timeout: 40000 });
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.openRowMenu();
    const index = lastDeviceUser.index - 1;
    const deleteBtn = page.locator(`#deleteDeviceUserBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    const cancelDeleteBtn = deviceUsersPage.cancelDeleteBtn();
    await cancelDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await cancelDeleteBtn.click();
    await cancelDeleteBtn.waitFor({ state: 'detached', timeout: 40000 });
    await deviceUsersPage.waitForRowCount(rowNumBeforeDelete);
    const rowNumAfterCancelDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete).toBe(rowNumAfterCancelDelete);
  });

  test('should delete user', async () => {
    await page
      .locator('#deviceUserId-0')
      .waitFor({ state: 'visible', timeout: 40000 });
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.openRowMenu();
    const index = lastDeviceUser.index - 1;
    const deleteBtn = page.locator(`#deleteDeviceUserBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    const saveDeleteBtn = deviceUsersPage.saveDeleteBtn();
    await saveDeleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await saveDeleteBtn.click();
    // The component closes the modal only after the DELETE round trip succeeded,
    // and only then reloads the grid - so detach + row count is the real signal.
    await saveDeleteBtn.waitFor({ state: 'detached', timeout: 40000 });
    await deviceUsersPage.waitForRowCount(rowNumBeforeDelete - 1);
    const rowNumAfterDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete).toBe(rowNumAfterDelete + 1);
  });
});
