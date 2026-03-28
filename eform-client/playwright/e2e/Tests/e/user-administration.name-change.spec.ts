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
    await loginPage.open('/auth');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should set name to Foo Bar', async () => {
    await myEformsPage.Navbar.goToUserAdministration();
    const user: UserAdministrationObject = {
      firstName: 'Foo',
      lastName: 'Bar',
      password: 'secretpassword',
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
      password: 'secretpassword',
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
    expect(countUserBeforeCreate + 1).toBe(
      await userAdministration.rowNum()
    );
  });
  test('should change new user role', async () => {
    let userObject = await userAdministration.getUserByNumber(2);
    const user: UserAdministrationObject = {
      role: 'Admin',
      password: randomPassword,
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
      password: randomPassword,
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
    expect(countUserBeforeDelete - 1).toBe(
      await userAdministration.rowNum()
    );
  });
});
