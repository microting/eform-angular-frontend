import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Folder page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    $('#newFolderBtn').waitForDisplayed({timeout: 10000});
    foldersPage.createNewFolder(name, description);
  });
  it('Should change name', function () {
    const newName = Guid.create().toString();
    const rowNumParentsBeforeDelete = foldersPage.rowNumParents;
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[rowNumParentsBeforeDelete - 1].click();
    const lastFolderBeforeEdit = foldersPage.getFolderFromTree(rowNumParentsBeforeDelete);
    foldersPage.editFolderTree(lastFolderBeforeEdit, newName, null);
    const lastFolderAfterEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    expect(lastFolderAfterEdit.nameTree, 'Name has been changed incorrectly').equal(newName);
    expect(lastFolderAfterEdit.descriptionTree,
      'Description has been changed after changing only first name').equal(lastFolderBeforeEdit.descriptionTree);
  });
  it('Should change description', function () {
    const newDescription = Guid.create().toString();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    foldersPage.editFolderTree(lastFolderBeforeEdit, null, newDescription);
    browser.pause(2000);
    const lastFolderAfterEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    expect(lastFolderAfterEdit.descriptionTree, 'Description has been changed incorrectly').equal(newDescription);
    expect(lastFolderAfterEdit.nameTree,
      'Name has been changed after changing only last name').equal(lastFolderBeforeEdit.nameTree);
  });
  it('Should not change first name and last name if cancel was clicked', function () {
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const rowNumBeforeEdit = foldersPage.rowNumParents;
    const lastFolderPageBeforeEdit = foldersPage.getFolderFromTree(rowNumBeforeEdit);
    lastFolderPageBeforeEdit.editTreeBtn.click();
    $('#editNameInput').waitForDisplayed({timeout: 10000});
    foldersPage.editNameInput.click();
    foldersPage.editNameInput.clearValue();
    foldersPage.editNameInput.setValue(newName);
    foldersPage.editDescriptionInput.click();
    foldersPage.editDescriptionInput.clearValue();
    foldersPage.editDescriptionInput.setValue(newDescription);
    foldersPage.cancelEditBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const rowNumAfterEdit = foldersPage.rowNumParents;
    expect(rowNumBeforeEdit).equal(rowNumAfterEdit);
    const lastFolderPageAfterEdit = foldersPage.getFolderFromTree(rowNumAfterEdit);
    expect(lastFolderPageAfterEdit.nameTree, 'Name has been changed').equal(lastFolderPageAfterEdit.nameTree);
    expect(lastFolderPageAfterEdit.descriptionTree, 'Description has been changed').equal(lastFolderPageAfterEdit.descriptionTree);
  });
});
