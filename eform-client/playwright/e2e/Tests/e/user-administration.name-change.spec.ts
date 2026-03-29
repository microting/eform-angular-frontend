import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import {
  UserAdministration,
  UserAdministrationObject,
} from '../../Page objects/UserAdministration.page';
import { generateRandmString } from '../../helper-functions';

test.describe.serial('User administration settings', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let userAdministration: UserAdministration;
  const randomPassword = generateRandmString();

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    userAdministration = new UserAdministration(page);
    await loginPage.open('/');
    await loginPage.login();
    await page.waitForTimeout(500);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should set name to Foo Bar', async () => {
    test.setTimeout(180000);
    await myEformsPage.Navbar.goToUserAdministration();
    // Retry navigation if grid doesn't load
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.waitForTimeout(5000);
      if (await page.locator('#userAdministrationEmail-0').isVisible()) break;
      if (attempt < 2) {
        await page.reload();
        await page.waitForTimeout(3000);
      }
    }
    const user: UserAdministrationObject = {
      firstName: 'Foo',
      lastName: 'Bar',
    };
    let userObject = await userAdministration.getUserByNumber();
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber();
    expect(userObject.fullName).toBe('Foo Bar');
  });
  test('should revert to old name', async () => {
    const user: UserAdministrationObject = {
      firstName: 'John',
      lastName: 'Smith',
    };
    let userObject = await userAdministration.getUserByNumber();
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber();
    expect(userObject.fullName).toBe('John Smith');
  });
  test('should create new user', async () => {
    const user: UserAdministrationObject = {
      firstName: generateRandmString(),
      lastName: generateRandmString(),
      group: 'eForm users',
      role: 'User',
      email: 'user@user.com',
      password: randomPassword,
    };
    const countUserBeforeCreate = await userAdministration.rowNum();
    await page.waitForTimeout(500);
    await userAdministration.createNewUser(user);
    await expect.poll(async () => await userAdministration.rowNum(), { timeout: 40000 }).toBe(countUserBeforeCreate + 1);
  });
  test('should change new user role', async () => {
    let userObject = await userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'Admin',
    };
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber(2);
    expect(userObject.role).toBe(
      user.role.toLowerCase()
    );
  });
  test('should revert new user role', async () => {
    let userObject = await userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'User',
      group: 'eForm users',
    };
    await userObject.edit(user);
    userObject = await userAdministration.getUserByNumber(2);
    expect(userObject.role).toBe(
      user.role.toLowerCase()
    );
  });
  test('should delete created user', async () => {
    const countUserBeforeDelete = await userAdministration.rowNum();
    await (await userAdministration.getUserByNumber(2)).delete();
    await expect.poll(async () => await userAdministration.rowNum(), { timeout: 40000 }).toBe(countUserBeforeDelete - 1);
  });
});
