import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const nameFolder = generateRandmString();
const nameFolderChildren = generateRandmString();
const newName = generateRandmString();
const newDescription = generateRandmString();

describe('Create folder', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await $('#newFolderBtn')).waitForDisplayed({ timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
  });
  it('Create folder child', async () => {
    const description = generateRandmString();
    const folder = await foldersPage.getFolderByName(nameFolder);
    const rowCountBeforeCreation = await foldersPage.rowChildrenNum();
    await folder.createChild(nameFolderChildren, description);
    await folder.expandChildren();
    const rowCountAfterCreation = await foldersPage.rowChildrenNum();
    expect(
      rowCountBeforeCreation + 1,
      'Number of rows has not changed after creating new folder'
    ).equal(rowCountAfterCreation);
  });
  it('Should change name', async () => {
    await browser.pause(500);
    const childFolderBeforeEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(nameFolderChildren),
      1
    );
    await childFolderBeforeEdit.editFolderChild(newName, null);
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const childFolderAfterEdit = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(newName),
      1
    );
    expect(childFolderAfterEdit.nameTree, 'Folder name has not changed').eq(
      newName
    );
  });
  it('Should change description', async () => {
    await browser.pause(500);
    const childFolder = await foldersPage.getFolderFromTree(
      await foldersPage.getFolderRowNumByName(newName),
      1
    );
    await childFolder.editFolderChild(null, newDescription);
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    const descriptionAfterEdit = await childFolder.getDescription();
    expect(
      descriptionAfterEdit.find((x) => x.language === 'Dansk').description,
      'Folder description has not changed',
      newDescription
    );
  });
  it('Should not change first name and description if cancel was clicked', async () => {
    await browser.pause(500);
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
    expect(rowParentsCountBeforeEditing).equal(rowParentsCountAfterEditing);
    expect(childFolderAfterEdit.nameTree, 'Name has been changed').equal(
      childFolderBeforeEdit.nameTree
    );
    expect(
      childFolderAfterEditDescription,
      'Description has been changed'
    ).equal(childFolderBeforeEditDescription);
  });
  // it('Should delete folder 1', async () => {
  //   const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
  //   await (await foldersPage
  //     .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
  //     .delete();
  //   const rowCountAfterDelete = await foldersPage.rowChildrenNum();
  //   expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  // });
  it('Should delete folder 2', async () => {
    const rowCountBeforeDelete = await foldersPage.rowNum();
    const folder = await foldersPage.getFolder(1);
    await folder.delete();
    const rowCountAfterDelete = await foldersPage.rowNum();
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
});
