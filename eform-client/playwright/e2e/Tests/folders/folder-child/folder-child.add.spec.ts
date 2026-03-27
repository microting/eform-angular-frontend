import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { FoldersPage } from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const nameFolder = generateRandmString();
let page;

test.describe('Create folder', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.newFolderBtn()).waitFor({ state: 'visible', timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
  });

  test.afterAll(async () => {
    const foldersPage = new FoldersPage(page);
    const folder = await foldersPage.getFolder(1);
    await folder.delete();
    await page.waitForTimeout(500);
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(0).toBe(rowCountAfterCreation);
    await page.close();
  });

  test('Create folder child with name and description', async () => {
    const foldersPage = new FoldersPage(page);
    const name = generateRandmString();
    const description = generateRandmString();
    const rowCountBeforeCreation = await foldersPage.rowChildrenNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.createChild(name, description);
    await folder.expandChildren();
    const rowCountAfterCreation = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeCreation + 1).toBe(rowCountAfterCreation);
  });
});
