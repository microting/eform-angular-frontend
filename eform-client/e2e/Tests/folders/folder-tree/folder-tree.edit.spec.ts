import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Folder page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    const name = generateRandmString();
    const description = generateRandmString();
    $('#newFolderBtn').waitForDisplayed({timeout: 10000});
    foldersPage.createNewFolder(name, description);
  });
  it('Should change name', function () {
    const newName = generateRandmString();
    const rowNumParentsBeforeDelete = foldersPage.rowNumParents;
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[rowNumParentsBeforeDelete - 1].click();
    const lastFolderBeforeEdit = foldersPage.getFolderFromTree(rowNumParentsBeforeDelete);
    const lastFolderBeforeEditDescription = lastFolderBeforeEdit.getDescription();
    foldersPage.editFolderTree(lastFolderBeforeEdit, newName, null);
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
    const lastFolderAfterEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    const lastFolderAfterEditDescription = lastFolderAfterEdit.getDescription();
    expect(lastFolderAfterEdit.nameTree, 'Name has been changed incorrectly').equal(newName);
    expect(lastFolderAfterEditDescription,
      'Description has been changed after changing only first name').equal(lastFolderBeforeEditDescription);
  });
  it('Should change description', function () {
    const newDescription = generateRandmString();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    foldersPage.editFolderTree(lastFolderBeforeEdit, null, newDescription);
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const lastFolderAfterEdit = foldersPage.getFolderFromTree(foldersPage.rowNumParents);
    lastFolderAfterEdit.editTreeBtn.click();
    const cancelEditBtn = $('#cancelEditBtn');
    cancelEditBtn.waitForDisplayed({timeout: 20000});
    expect($('#editDescriptionInput').getValue(), 'Description has been changed incorrectly').equal(newDescription);
    expect($('#editNameInput').getValue(),
      'Name has been changed after changing only last name').equal(lastFolderBeforeEdit.nameTree);
    cancelEditBtn.click();
  });
  it('Should not change first name and last name if cancel was clicked', function () {
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const rowNumBeforeEdit = foldersPage.rowNumParents;
    const lastFolderPageBeforeEdit = foldersPage.getFolderFromTree(rowNumBeforeEdit);
    const lastFolderPageBeforeEditDescription = lastFolderPageBeforeEdit.getDescription();
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
    const lastFolderPageAfterEditDescription = lastFolderPageAfterEdit.getDescription();
    expect(lastFolderPageBeforeEdit.nameTree, 'Name has been changed').equal(lastFolderPageAfterEdit.nameTree);
    expect(lastFolderPageBeforeEditDescription, 'Description has been changed').equal(lastFolderPageAfterEditDescription);
  });
  it('Should delete folder', function () {
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
