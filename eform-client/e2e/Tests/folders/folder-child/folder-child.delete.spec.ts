import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childName = Guid.create().toString();
    const childDescription = Guid.create().toString();
    foldersPage.createFolderChild(rowParentsCountBeforeCreation, childName, childDescription);
  });
  it('Delete folder child with name and description', function () {
    const rowCountBeforeDelete = foldersPage.rowNum;
    const rowParentsCountBeforeDelete = foldersPage.rowNumParents;
    const childRowToDelete = foldersPage.rowNumParents + 1;
    foldersPage.deleteFolderChild(rowParentsCountBeforeDelete, childRowToDelete);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const rowCountAfterDelete = foldersPage.rowNum;
    const rowParentsCountAfterDelete = foldersPage.rowNumParents;
    expect(rowCountAfterDelete, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeDelete - 1);
    expect(rowParentsCountAfterDelete, 'Number os parent folder has changed', rowParentsCountBeforeDelete);
  });
  it('If cancel was clicked', function () {
    const rowCountBeforeDelete = foldersPage.rowNum;
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childName = Guid.create().toString();
    const childDescription = Guid.create().toString();
    foldersPage.createFolderChild(rowParentsCountBeforeCreation, childName, childDescription);
    const childRowToDelete = foldersPage.rowNumParents + 1;
    $$('#folderTreeName')[childRowToDelete - 2].waitForDisplayed({timeout: 10000});
    $$('#folderTreeName')[childRowToDelete - 2].click();
    $('#deleteFolderTreeBtn').waitForDisplayed({timeout: 10000});
    $('#deleteFolderTreeBtn').click();
    foldersPage.cancelDeleteBtn.click();
    const rowCountAfterDelete = foldersPage.rowNum;
    expect(rowCountBeforeDelete, 'Folder was deleted', rowCountAfterDelete);
  });
});


