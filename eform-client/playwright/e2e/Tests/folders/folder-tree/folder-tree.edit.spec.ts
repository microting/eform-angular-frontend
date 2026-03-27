import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { FoldersPage } from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

let name = generateRandmString();
let page;

test.describe('Folder page', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    const description = generateRandmString();
    await (await foldersPage.newFolderBtn()).waitFor({ state: 'visible', timeout: 10000 });
    await foldersPage.createNewFolder(name, description);
  });

  test.afterAll(async () => {
    const foldersPage = new FoldersPage(page);
    const lastFolder = await foldersPage.getFolderByName(name);
    await lastFolder.delete();
    expect(await foldersPage.getFolderByName(name)).toBe(null);
    await page.close();
  });

  test('Should change name', async () => {
    const foldersPage = new FoldersPage(page);
    const folderBeforeEdit = await foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = (await folderBeforeEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    name = generateRandmString();
    await folderBeforeEdit.editFolder(name);
    const folderAfterEdit = await foldersPage.getFolderByName(name);
    expect(folderAfterEdit.name).toBe(name);
    expect(
      (await folderAfterEdit.getDescription()).find((x) => x.language === 'Dansk')
        .description
    ).toBe(descriptionBeforeEdit);
  });

  test('Should change description', async () => {
    const foldersPage = new FoldersPage(page);
    const newDescription = generateRandmString();
    await page.locator('.folder-tree-name').waitFor({ state: 'visible', timeout: 40000 });
    const lastFolderBeforeEdit = await foldersPage.getFolderByName(name);
    await lastFolderBeforeEdit.editFolder(null, newDescription);
    await (await foldersPage.newFolderBtn()).waitFor({ state: 'visible', timeout: 40000 });
    const folder = await foldersPage.getFolderByName(name);
    expect(folder.name).toBe(lastFolderBeforeEdit.name);
    expect(
      (await folder.getDescription()).find((x) => x.language === 'Dansk').description
    ).toBe(newDescription);
  });

  test('Should not change name and description if cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    await page.locator('.folder-tree-name').waitFor({ state: 'visible', timeout: 40000 });
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const lastFolderPageBeforeEdit = await foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = (await lastFolderPageBeforeEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    await lastFolderPageBeforeEdit.editFolder(newName, newDescription, true);
    const lastFolderPageAfterEdit = await foldersPage.getFolderByName(name);
    expect(lastFolderPageAfterEdit.name).toBe(lastFolderPageAfterEdit.name);
    expect(
      (await lastFolderPageAfterEdit
        .getDescription())
        .find((x) => x.language === 'Dansk').description
    ).toBe(descriptionBeforeEdit);
  });
});
