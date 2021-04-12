import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let nameFolder = generateRandmString();

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', function () {
    // Create
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
    const rowNumBeforeDelete = foldersPage.rowNum;

    $('#folderTreeName').waitForDisplayed({ timeout: 20000 });
    const folder = foldersPage.getFolderByName(nameFolder);
    folder.delete();
    const rowNumAfterDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete - 1, 'Folder was deleted incorrectly').equal(
      rowNumAfterDelete
    );
  });
  it('Should not delete if cancel was clicked', function () {
    // Create
    nameFolder = generateRandmString();
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);

    // Delete
    const rowNumBeforeDelete = foldersPage.rowNum;
    const folder = foldersPage.getFolderByName(nameFolder);
    folder.delete(true);
    const rowNumAfterCancelDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
  after('Should delete folder', function () {
    $('#folderTreeName').waitForDisplayed({ timeout: 20000 });
    const folder = foldersPage.getFolderByName(nameFolder);
    const countFoldersBeforeDelete = foldersPage.rowNum;
    folder.delete();
    const countFoldersAfterDelete = foldersPage.rowNum;
    expect(countFoldersBeforeDelete - 1).eq(countFoldersAfterDelete);
  });
});
