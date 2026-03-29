import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { FoldersPage } from '../../Page objects/Folders.page';
import { generateRandmString } from '../../helper-functions';

const nameFolder = generateRandmString();
const nameFolderChildren = generateRandmString();
const newName = generateRandmString();
const newDescription = generateRandmString();
let page;

test.describe.serial('Create folder', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const foldersPage = new FoldersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await page.locator('#newFolderBtn').waitFor({ state: 'visible', timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Create folder child', async () => {
    const foldersPage = new FoldersPage(page);
    const description = generateRandmString();
    const folder = await foldersPage.getFolderByName(nameFolder);
    const rowCountBeforeCreation = await foldersPage.rowChildrenNum();
    await folder.createChild(nameFolderChildren, description);
    await folder.expandChildren();
    const rowCountAfterCreation = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeCreation + 1).toBe(rowCountAfterCreation);
  });

  test('Should change name', async () => {
    const foldersPage = new FoldersPage(page);
    await page.waitForTimeout(500);
    let folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childFolderBeforeEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(nameFolderChildren),
      1
    );
    await childFolderBeforeEdit.editFolderChild(newName, null);
    folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childFolderAfterEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(newName),
      1
    );
    expect(childFolderAfterEdit.nameTree).toBe(newName);
  });

  test('Should change description', async () => {
    const foldersPage = new FoldersPage(page);
    await page.waitForTimeout(500);
    const childFolder = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(newName),
      1
    );
    await childFolder.editFolderChild(null, newDescription);
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const descriptionAfterEdit = await childFolder.getDescription();
    expect(
      descriptionAfterEdit.find((x) => x.language === 'Dansk').description
    ).toBe(newDescription);
  });

  test('Should not change first name and description if cancel was clicked', async () => {
    const foldersPage = new FoldersPage(page);
    await page.waitForTimeout(500);
    const rowParentsCountBeforeEditing = await foldersPage.rowNumParents();
    const childFolderBeforeEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(newName),
      1
    );
    const childFolderBeforeEditDescription = (await childFolderBeforeEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    await childFolderBeforeEdit.editFolderChild(newName, newDescription, true);
    const rowParentsCountAfterEditing = await foldersPage.rowNumParents();
    const childFolderAfterEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    const childFolderAfterEditDescription = (await childFolderAfterEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    expect(rowParentsCountBeforeEditing).toBe(rowParentsCountAfterEditing);
    expect(childFolderAfterEdit.nameTree).toBe(childFolderBeforeEdit.nameTree);
    expect(childFolderAfterEditDescription).toBe(childFolderBeforeEditDescription);
  });

  test('Should delete folder 2', async () => {
    const foldersPage = new FoldersPage(page);
    // Delete child first, then parent
    let folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const child = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(nameFolder), 1
    );
    await child.delete();
    await page.waitForTimeout(2000);
    const rowCountBeforeDelete = await foldersPage.rowNum();
    folder = await foldersPage.getFolderByName(nameFolder);
    await folder.delete();
    await expect.poll(async () => await foldersPage.rowNum(), { timeout: 10000 }).toBe(rowCountBeforeDelete - 1);
  });
});
