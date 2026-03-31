import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage, DeviceUsersRowObject } from '../../Page objects/DeviceUsers.page';
import { FoldersPage, FoldersRowObject } from '../../Page objects/Folders.page';

const users = new Array<DeviceUsersRowObject>();
const folders = new Array<FoldersRowObject>();

test.describe.serial('Main page', () => {
  let page: Page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let deviceUsersPage: DeviceUsersPage;
  let foldersPage: FoldersPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    // Create 2 device users
    await deviceUsersPage.createNewDeviceUser('testName1', 'testLastName1');
    await deviceUsersPage.createNewDeviceUser('testName2', 'testLastName2');
    users.push(await deviceUsersPage.getDeviceUserByName('testName1'));
    users.push(await deviceUsersPage.getDeviceUserByName('testName2'));
    await myEformsPage.Navbar.goToFolderPage();
    // Create folder
    await foldersPage.createNewFolder('test folder', 'desc');
    folders.push(await foldersPage.getFolderByName('test folder'));
    await myEformsPage.Navbar.goToMyEForms();
    // Create e-form
    await myEformsPage.createNewEform('test Eform');
  });

  test.afterAll(async () => {
    await page.waitForTimeout(1000);
    const eform = await myEformsPage.getEformsRowObjByNameEForm('test Eform');
    if (eform) {
      await eform.deleteEForm();
    }
    await myEformsPage.Navbar.goToDeviceUsersPage();
    for (let i = 0; i < users.length; i++) {
      await (await deviceUsersPage.getDeviceUserByName(users[i].firstName)).delete();
    }
    await myEformsPage.Navbar.goToFolderPage();
    for (let i = 0; i < folders.length; i++) {
      await (await foldersPage.getFolderByName(folders[i].name)).delete();
    }
    await page.close();
  });

  test('should pair several device users', async () => {
    test.setTimeout(240000);
    await (await myEformsPage.idSortBtn()).click();
    await loginPage.waitForSpinnerHide(40000);
    await page.waitForTimeout(1000);
    let eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.pair(folders[0], users);
    eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.editPairEformBtn.click();
    await loginPage.waitForSpinnerHide(40000);
    await page.waitForTimeout(1000);
    await (await myEformsPage.cancelParingBtn()).waitFor({ state: 'visible', timeout: 40000 });
    expect(
      await page.locator('mat-tree-node > .selected-folder > div').textContent()
    ).toContain(`${folders[0].name}`);
    const siteIds = await page.locator('[id^="microtingId-"]').all();
    for (let i = 0; i < siteIds.length; i++) {
      const siteIdText = await siteIds[i].textContent();
      const index = users.findIndex(
        (user) => user.siteId === +(siteIdText || '0')
      );
      if (index !== -1) {
        const checkbox = page.locator(`#checkbox${users[index].siteId}`).locator('input[type="checkbox"]');
        expect(await checkbox.isChecked()).toBe(true);
      }
    }
    await (await myEformsPage.cancelParingBtn()).click();
    await page.waitForTimeout(1000);
  });

  test('should unpair one', async () => {
    await (await myEformsPage.getFirstMyEformsRowObj()).unPair([users[1]]);
    await page.waitForTimeout(1000);
    (await myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
    await loginPage.waitForSpinnerHide(40000);
    const siteIds = await page.locator('[id^="microtingId-"]').all();
    for (let i = 0; i < siteIds.length; i++) {
      if (users[1].siteId === +(await siteIds[i].textContent())) {
        expect(
          await page.locator(`#checkbox${users[1].siteId}-input`).evaluate((el: HTMLInputElement) => el.checked)
        ).toBe(false);
      }
      if (users[0].siteId === +(await siteIds[i].textContent())) {
        expect(
          await page.locator(`#checkbox${users[0].siteId}-input`).evaluate((el: HTMLInputElement) => el.checked)
        ).toBe(true);
      }
    }
    await (await myEformsPage.cancelParingBtn()).click();
  });
});
