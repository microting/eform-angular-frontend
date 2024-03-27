import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

import {expect} from 'chai';
let nameFolder = generateRandmString();

describe('Delete folder', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', async () => {
    // Create
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
    const rowNumBeforeDelete = await foldersPage.rowNum();

    await (await $('.folder-tree-name')).waitForDisplayed({ timeout: 40000 });
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.delete();
    const rowNumAfterDelete = await foldersPage.rowNum();
    expect(rowNumBeforeDelete - 1, 'Folder was deleted incorrectly').equal(
      rowNumAfterDelete
    );
  });
  it('Should not delete if cancel was clicked', async () => {
    // Create
    nameFolder = generateRandmString();
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);

    // Delete
    const rowNumBeforeDelete = await foldersPage.rowNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.delete(true);
    const rowNumAfterCancelDelete = await foldersPage.rowNum();
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
  after('Should delete folder', async () => {
    await (await $('.folder-tree-name')).waitForDisplayed({ timeout: 40000 });
    const folder = await foldersPage.getFolderByName(nameFolder);
    const countFoldersBeforeDelete = await foldersPage.rowNum();
    await folder.delete();
    const countFoldersAfterDelete = await foldersPage.rowNum();
    expect(countFoldersBeforeDelete - 1).eq(countFoldersAfterDelete);
  });
});
