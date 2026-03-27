import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { FoldersPage } from '../../Page objects/Folders.page';
import { generateRandmString } from '../../helper-functions';

const nameFolder = generateRandmString();
const childName = generateRandmString();
let page;

test.describe('Delete folder', () => {
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
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(childName), 1))
      .delete();
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(rowCountAfterDelete).toBe(rowCountBeforeDelete - 1);
  });

  test('If cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    const newChildName = generateRandmString();
    const childDescription = generateRandmString();
    await (await foldersPage
      .getFolderByName(nameFolder))
      .createChild(newChildName, childDescription);
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete(true);
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeDelete).toBe(rowCountAfterDelete);
  });

  test('Should delete folder 1', async () => {
    const foldersPage = new FoldersPage(page);
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete();
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeDelete - 1).toBe(rowCountAfterDelete);
  });

  test('Should delete folder 2', async () => {
    const foldersPage = new FoldersPage(page);
    const rowCountBeforeDelete = await foldersPage.rowNum();
    await (await foldersPage.getFolderByName(nameFolder)).delete();
    const rowCountAfterDelete = await foldersPage.rowNum();
    expect(rowCountBeforeDelete - 1).toBe(rowCountAfterDelete);
  });
});
