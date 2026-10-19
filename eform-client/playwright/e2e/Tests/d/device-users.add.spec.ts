import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage, DeviceUsersRowObject } from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../helper-functions';

const nameDeviceUser = generateRandmString();
let countDeviceUsersBeforeCreating = 0;

test.describe('Device users page should add new device user', () => {
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
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 41000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('with first name and last name', async () => {
    const surname = generateRandmString();
    const rowCountBeforeCreation = await deviceUsersPage.rowNum();
    countDeviceUsersBeforeCreating = rowCountBeforeCreation;
    await deviceUsersPage.createNewDeviceUser(nameDeviceUser, surname);
    const rowCountAfterCreation = await deviceUsersPage.rowNum();
    expect(rowCountAfterCreation).toBe(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    expect(lastDeviceUser.firstName).toBe(nameDeviceUser);
    expect(lastDeviceUser.lastName).toBe(surname);
  });
});

test.describe('Device users page should not add new device user', () => {
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
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('with only first name', async () => {
    const name = generateRandmString();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await deviceUsersPage.newDeviceUserBtn().click();
    await page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    await (await deviceUsersPage.createFirstNameInput()).fill(name);
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled()
    ).toBe(false);

    await (await deviceUsersPage.cancelCreateBtn()).click();
    await page.waitForTimeout(500);
  });

  test('with only last name', async () => {
    const lastName = generateRandmString();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    await (await deviceUsersPage.createLastNameInput()).fill(lastName);
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled()
    ).toBe(false);

    await (await deviceUsersPage.cancelCreateBtn()).click();
    await page.waitForTimeout(500);
  });

  test('without first and last names', async () => {
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await page.waitForTimeout(500);
    await page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled()
    ).toBe(false);
    await (await deviceUsersPage.cancelCreateBtn()).click();
    await page.waitForTimeout(500);
  });

  test('if cancel was clicked', async () => {
    const rowCountBeforeCreation = await deviceUsersPage.rowNum();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await page.locator('#firstName').waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(500);
    await (await deviceUsersPage.cancelCreateBtn()).click();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await page.waitForTimeout(500);
    const rowCountAfterCreation = await deviceUsersPage.rowNum();
    expect(rowCountAfterCreation).toBe(rowCountBeforeCreation);
  });

  test('should clean up', async () => {
    const deviceUser = await deviceUsersPage.getDeviceUserByName(nameDeviceUser);
    expect(deviceUser).not.toBeNull();
    await deviceUser.delete();
    expect(await deviceUsersPage.rowNum()).toBe(countDeviceUsersBeforeCreating);
  });
});
