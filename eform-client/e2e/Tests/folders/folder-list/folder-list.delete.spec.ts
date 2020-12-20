import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameFolderForDelete = generateRandmString();
describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', function () {
    // Create
    const name = generateRandmString();
    const description = generateRandmString();
    foldersPage.createNewFolder(name, description);
    const rowNumBeforeDelete = foldersPage.rowNum;

    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const folder = foldersPage.getFolderByName(name);
    folder.delete();
    const rowNumAfterDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete - 1, 'Folder was deleted incorrectly').equal(rowNumAfterDelete);
  });
  it('Should not delete if cancel was clicked', function () {
    // Create
    const name = nameFolderForDelete;
    const description = generateRandmString();
    foldersPage.createNewFolder(name, description);

    // Delete
    const rowNumBeforeDelete = foldersPage.rowNum;
    const folder = foldersPage.getFolderByName(name);
    folder.folderElement.waitForDisplayed({timeout: 20000});
    folder.folderElement.click();
    folder.deleteBtn.waitForDisplayed({timeout: 5000 });
    folder.deleteBtn.waitForClickable({timeout: 20000});
    folder.deleteBtn.click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.cancelDeleteBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000, reverse: true});
    browser.pause(500);
    const rowNumAfterCancelDelete = foldersPage.rowNum;
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
  it('Should delete folder', function () {
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const folder = foldersPage.getFolderByName(nameFolderForDelete);
    folder.folderElement.click();
    const countFoldersBeforeDelete = foldersPage.rowNum;
    folder.delete();
    const countFoldersAfterDelete = foldersPage.rowNum;
    expect(countFoldersBeforeDelete - 1).eq(countFoldersAfterDelete);
  });
});
