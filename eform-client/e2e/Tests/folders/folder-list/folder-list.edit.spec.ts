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
    $('#folderName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolder(foldersPage.rowNum);
    foldersPage.editFolder(lastFolderBeforeEdit, newName, null);
    browser.pause(2000);
    const lastFolderAfterEdit = foldersPage.getFolder(foldersPage.rowNum);
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    expect(lastFolderAfterEdit.name, 'Name has been changed incorrectly').equal(newName);
    expect(lastFolderAfterEdit.description,
      'Description has been changed after changing only first name').equal(lastFolderBeforeEdit.description);
  });
  it('Should change description', function () {
    const newDescription = Guid.create().toString();
    $('#folderName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolder(foldersPage.rowNum);
    foldersPage.editFolder(lastFolderBeforeEdit, null, newDescription);
    browser.pause(2000);
    const lastFolderAfterEdit = foldersPage.getFolder(foldersPage.rowNum);
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    expect(lastFolderAfterEdit.description, 'Description has been changed incorrectly').equal(newDescription);
    expect(lastFolderAfterEdit.name,
      'Name has been changed after changing only last name').equal(lastFolderBeforeEdit.name);
  });
  it('Should not change first name and last name if cancel was clicked', function () {
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const rowNumBeforeEdit = foldersPage.rowNum;
    const lastFolderPageBeforeEdit = foldersPage.getFolder(rowNumBeforeEdit);
    lastFolderPageBeforeEdit.editBtn.click();
    $('#editNameInput').waitForDisplayed({timeout: 10000});
    foldersPage.editNameInput.click();
    foldersPage.editNameInput.clearValue();
    foldersPage.editNameInput.setValue(newName);
    foldersPage.editDescriptionInput.click();
    foldersPage.editDescriptionInput.clearValue();
    foldersPage.editDescriptionInput.setValue(newDescription);
    foldersPage.cancelEditBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const rowNumAfterEdit = foldersPage.rowNum;
    expect(rowNumBeforeEdit).equal(rowNumAfterEdit);
    const lastFolderPageAfterEdit = foldersPage.getFolder(rowNumAfterEdit);
    expect(lastFolderPageAfterEdit.name, 'Name has been changed').equal(lastFolderPageAfterEdit.name);
    expect(lastFolderPageAfterEdit.description, 'Description has been changed').equal(lastFolderPageAfterEdit.description);
  });
})
;
