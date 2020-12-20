import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameFolder = generateRandmString();

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
    // const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    foldersPage.getFolderByName(nameFolder).createChild(childName, childDescription);
  });
  it('Delete folder child with name and description', function () {
    const rowCountBeforeDelete = foldersPage.rowNum;
    const rowParentsCountBeforeDelete = foldersPage.rowNumParents;
    const childRowToDelete = foldersPage.rowNumParents + 1;
    foldersPage.deleteFolderChild(rowParentsCountBeforeDelete, childRowToDelete);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    // TODO Add tests for the changes.
    // const rowCountAfterDelete = foldersPage.rowNum;
    // const rowParentsCountAfterDelete = foldersPage.rowNumParents;
    // expect(rowCountAfterDelete, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeDelete - 1);
    // expect(rowParentsCountAfterDelete, 'Number os parent folder has changed', rowParentsCountBeforeDelete);
  });
  it('If cancel was clicked', function () {
    const rowCountBeforeDelete = foldersPage.rowNum;
    // const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    foldersPage.getFolderByName(nameFolder).createChild(childName, childDescription);
    const childRowToDelete = foldersPage.rowNumParents + 1;
    $$('#folderTreeName')[childRowToDelete - 2].waitForDisplayed({timeout: 10000});
    $$('#folderTreeName')[childRowToDelete - 2].click();
    $('#deleteFolderTreeBtn').waitForDisplayed({timeout: 10000});
    $('#deleteFolderTreeBtn').click();
    foldersPage.cancelDeleteBtn.click();
    const rowCountAfterDelete = foldersPage.rowNum;
    expect(rowCountBeforeDelete, 'Folder was deleted', rowCountAfterDelete);
  });
  it('Should delete folder 1', function () {
    // Create
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeOpenClose')[0].click();
    browser.pause(500);
    $$('#folderTreeName')[1].click();
    browser.pause(500);
    $$('#deleteFolderTreeBtn')[0].waitForDisplayed({timeout: 5000});
    $$('#deleteFolderTreeBtn')[0].click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('Should delete folder 2', function () {
    // Create
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[0].click();
    const lastFolder = foldersPage.getFolder(1);
    lastFolder.deleteBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
});


