import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';
import { SitesPage } from '../../Page objects/Sites.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const aTagName = generateRandmString();
const bTagName = generateRandmString();

test.describe('Site tags', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let deviceUsersPage: DeviceUsersPage;
  let sitesPage: SitesPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    sitesPage = new SitesPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await page.locator('#newDeviceUserBtn').waitFor({ state: 'visible', timeout: 40000 });
    await deviceUsersPage.createDeviceUserFromScratch('John', 'Doe');
    await myEformsPage.Navbar.goToSites();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should create new tag', async () => {
    await sitesPage.createTag([aTagName]);
  });
  test('should create new b tag', async () => {
    await sitesPage.createTag([bTagName]);
  });
  test('should assign tag', async () => {
    await page.waitForTimeout(500);
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [aTagName] });
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(aTagName)).toBeTruthy();
  });
  test('should cancel assign tag', async () => {
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [bTagName] }, true);
    await page.waitForTimeout(1500);
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(bTagName)).toBe(false);
    expect(site.tags.includes(aTagName)).toBeTruthy();
  });
  test('should delete tag', async () => {
    await sitesPage.removeTags([aTagName]);
  });
  test('should delete tag', async () => {
    await sitesPage.removeTags([bTagName]);
  });
  test('should delete user', async () => {
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await (await deviceUsersPage.getDeviceUser(rowNumBeforeDelete)).delete();
  });
});
