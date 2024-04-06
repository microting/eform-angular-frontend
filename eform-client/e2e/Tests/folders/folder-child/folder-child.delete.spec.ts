import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const nameFolder = generateRandmString();
const childName = generateRandmString();

describe('Delete folder', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
    // const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childDescription = generateRandmString();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.createChild(childName, childDescription);
    await folder.expandChildren();
  });
  it('Delete folder child with name and description', async () => {
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(childName), 1))
      .delete();
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(
      rowCountAfterDelete,
      'Number of rows hasn\'t changed after creating new folder'
    ).equal(rowCountBeforeDelete - 1);
  });
  it('If cancel was clicked', async () => {
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    await (await foldersPage
      .getFolderByName(nameFolder))
      .createChild(childName, childDescription);
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.expandChildren();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete(true);
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeDelete, 'Folder was deleted', rowCountAfterDelete);
  });
  it('Should delete folder 1', async () => {
    const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
    await (await foldersPage
      .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1))
      .delete();
    const rowCountAfterDelete = await foldersPage.rowChildrenNum();
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
  it('Should delete folder 2', async () => {
    const rowCountBeforeDelete = await foldersPage.rowNum();
    await (await foldersPage.getFolderByName(nameFolder)).delete();
    const rowCountAfterDelete = await foldersPage.rowNum();
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
});
