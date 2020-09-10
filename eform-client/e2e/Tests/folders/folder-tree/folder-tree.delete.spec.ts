import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', function () {
    // Create
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);
    const rowNumParentsBeforeDelete = foldersPage.rowNumParents;
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[rowNumParentsBeforeDelete - 1].click();
    const lastFolder = foldersPage.getFolderFromTree(rowNumParentsBeforeDelete);
    lastFolder.deleteTreeBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteTreeBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    const rowNumParentsAfterDelete = foldersPage.rowNumParents;
    expect(rowNumParentsBeforeDelete, 'Folder was deleted incorrectly').equal(rowNumParentsAfterDelete + 1);
  });
  it('Should not delete if cancel was clicked', function () {
    // Create
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);

    // Delete
    const rowNumParentsBeforeDelete = foldersPage.rowNumParents;
    console.log(rowNumParentsBeforeDelete);
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[rowNumParentsBeforeDelete - 1].click();
    const lastFolder = foldersPage.getFolderFromTree(rowNumParentsBeforeDelete);
    lastFolder.deleteTreeBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteTreeBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.cancelDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    const rowNumParentsAfterCancelDelete = foldersPage.rowNumParents;
    console.log(rowNumParentsAfterCancelDelete);
    expect(rowNumParentsBeforeDelete).equal(rowNumParentsAfterCancelDelete);
  });
});
