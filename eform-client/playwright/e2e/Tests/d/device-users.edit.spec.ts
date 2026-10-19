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

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await deviceUsersPage.createNewDeviceUser(firstName, lastName);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should change first name', async () => {
    const newName = Guid.create().toString();
    await page.locator('#deviceUserFirstName-0').waitFor({ state: 'visible', timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, newName, null);
    await page.waitForTimeout(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    expect(lastDeviceUserAfterEdit.firstName).toBe(newName);
    expect(lastDeviceUserAfterEdit.lastName).toBe(lastDeviceUserBeforeEdit.lastName);
  });

  test('should change last name', async () => {
    const newSurname = Guid.create().toString();
    await page.locator('#deviceUserFirstName-0').waitFor({ state: 'visible', timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, null, newSurname);
    await page.waitForTimeout(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    expect(lastDeviceUserAfterEdit.lastName).toBe(newSurname);
    expect(lastDeviceUserAfterEdit.firstName).toBe(lastDeviceUserBeforeEdit.firstName);
  });

  test('should change first name and last name', async () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    await page.locator('#deviceUserFirstName-0').waitFor({ state: 'visible', timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(
      lastDeviceUserBeforeEdit,
      newName,
      newSurname
    );
    await page.waitForTimeout(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    expect(lastDeviceUserAfterEdit.firstName).toBe(newName);
    expect(lastDeviceUserAfterEdit.lastName).toBe(newSurname);
  });

  test('should not change first name and last name if cancel was clicked', async () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    const rowNumBeforeEdit = await deviceUsersPage.rowNum();
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      rowNumBeforeEdit
    );
    await lastDeviceUserBeforeEdit.openRowMenu();
    const index = lastDeviceUserBeforeEdit.index - 1;
    const editBtn = page.locator(`#editDeviceUserBtn${index}`);
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();
    await page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    await (await deviceUsersPage.editFirstNameInput()).click();
    await (await deviceUsersPage.editFirstNameInput()).clear();
    await (await deviceUsersPage.editFirstNameInput()).fill(newName);
    await (await deviceUsersPage.editLastNameInput()).click();
    await (await deviceUsersPage.editLastNameInput()).clear();
    await (await deviceUsersPage.editLastNameInput()).fill(newSurname);
    await (await deviceUsersPage.cancelEditBtn()).click();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    const rowNumAfterEdit = await deviceUsersPage.rowNum();
    expect(rowNumBeforeEdit).toBe(rowNumAfterEdit);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      rowNumAfterEdit
    );
    expect(lastDeviceUserAfterEdit.firstName).toBe(
      lastDeviceUserBeforeEdit.firstName
    );
    expect(lastDeviceUserAfterEdit.lastName).toBe(
      lastDeviceUserBeforeEdit.lastName
    );
  });
});
