import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { FoldersPage } from '../../Page objects/Folders.page';
import { generateRandmString } from '../../helper-functions';

const nameFolder = generateRandmString();
const childName = generateRandmString();
let page;

test.describe.serial('Delete folder', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await foldersPage.newFolderBtn().waitFor({ state: 'visible', timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
    const childDescription = generateRandmString();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.createChild(childName, childDescription);
    await folder.expandChildren();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Delete folder child with name and description', async () => {
    const foldersPage = new FoldersPage(page);
    // Ensure children are expanded
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childrenLocator = page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node.children');
    const rowCountBeforeDelete = await childrenLocator.count();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete();
    await expect.poll(async () => await childrenLocator.count(), { timeout: 10000 }).toBe(rowCountBeforeDelete - 1);
  });

  test('If cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    const newChildName = generateRandmString();
    const childDescription = generateRandmString();
    await (await foldersPage
      .getFolderByName(nameFolder))
      .createChild(newChildName, childDescription);
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childrenLocator = page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node.children');
    const rowCountBeforeDelete = await childrenLocator.count();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete(true);
    const rowCountAfterDelete = await childrenLocator.count();
    expect(rowCountBeforeDelete).toBe(rowCountAfterDelete);
  });

  test('Should delete folder 1', async () => {
    const foldersPage = new FoldersPage(page);
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childrenLocator = page.locator('app-eform-tree-view-picker > mat-tree > mat-tree-node.children');
    const rowCountBeforeDelete = await childrenLocator.count();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete();
    await expect.poll(async () => await childrenLocator.count(), { timeout: 10000 }).toBe(rowCountBeforeDelete - 1);
  });

  test('Should delete folder 2', async () => {
    const foldersPage = new FoldersPage(page);
    const rowCountBeforeDelete = await foldersPage.rowNum();
    await (await foldersPage.getFolderByName(nameFolder)).delete();
    const rowCountAfterDelete = await foldersPage.rowNum();
    expect(rowCountBeforeDelete - 1).toBe(rowCountAfterDelete);
  });
});
