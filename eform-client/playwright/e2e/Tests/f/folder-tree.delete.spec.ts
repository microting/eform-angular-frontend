import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { FoldersPage } from '../../Page objects/Folders.page';
import { generateRandmString } from '../../helper-functions';

let nameFolder = generateRandmString();
let page;

test.describe('Delete folder', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
  });

  test.afterAll(async () => {
    const foldersPage = new FoldersPage(page);
    await page.locator('.folder-tree-name').waitFor({ state: 'visible', timeout: 40000 });
    const folder = await foldersPage.getFolderByName(nameFolder);
    const countFoldersBeforeDelete = await foldersPage.rowNum();
    await folder.delete();
    const countFoldersAfterDelete = await foldersPage.rowNum();
    expect(countFoldersBeforeDelete - 1).toBe(countFoldersAfterDelete);
    await page.close();
  });

  test('Should delete', async () => {
    const foldersPage = new FoldersPage(page);
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
    const rowNumBeforeDelete = await foldersPage.rowNum();

    await page.locator('.folder-tree-name').waitFor({ state: 'visible', timeout: 40000 });
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.delete();
    const rowNumAfterDelete = await foldersPage.rowNum();
    expect(rowNumBeforeDelete - 1).toBe(rowNumAfterDelete);
  });

  test('Should not delete if cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    nameFolder = generateRandmString();
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);

    const rowNumBeforeDelete = await foldersPage.rowNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.delete(true);
    const rowNumAfterCancelDelete = await foldersPage.rowNum();
    expect(rowNumBeforeDelete).toBe(rowNumAfterCancelDelete);
  });
});
