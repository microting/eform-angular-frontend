import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let name = generateRandmString();

describe('Folder page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    const description = generateRandmString();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 10000});
    foldersPage.createNewFolder(name, description);
  });
  it('Should change name', function () {
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = lastFolderBeforeEdit.getDescription();
    name = generateRandmString();
    lastFolderBeforeEdit.editFolder(name, null);
    const lastFolderAfterEdit = foldersPage.getFolderByName(name);
    lastFolderAfterEdit.openEditModal();
    expect(foldersPage.editNameInput.getValue(), 'Name has been changed incorrectly').equal(name);
    expect(foldersPage.editDescriptionInput.getValue(),
      'Description has been changed after changing only first name').equal(descriptionBeforeEdit);
    foldersPage.cancelEditBtn.click();
  });
  it('Should change description', function () {
    const newDescription = generateRandmString();
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const lastFolderBeforeEdit = foldersPage.getFolderByName(name);
    lastFolderBeforeEdit.editFolder(null, newDescription);
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
    foldersPage.getFolderByName(name).openEditModal();
    expect(foldersPage.editDescriptionInput.getValue(), 'Description has been changed incorrectly').equal(newDescription);
    expect(foldersPage.editNameInput.getValue(),
      'Name has been changed after changing only last name').equal(lastFolderBeforeEdit.name);
    foldersPage.cancelEditBtn.click();
  });
  it('Should not change name and description if cancel was clicked', function () {
    const folderTreeName = $('#folderTreeName');
    folderTreeName.waitForDisplayed({timeout: 20000});
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const lastFolderPageBeforeEdit = foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = lastFolderPageBeforeEdit.getDescription();
    lastFolderPageBeforeEdit.editFolder(newName, newDescription, true);
    const lastFolderPageAfterEdit = foldersPage.getFolderByName(name);
    lastFolderPageAfterEdit.openEditModal();
    expect(foldersPage.editNameInput.getValue(), 'Name has been changed').equal(lastFolderPageAfterEdit.name);
    expect(foldersPage.editDescriptionInput.getValue(), 'Description has been changed').equal(descriptionBeforeEdit);
    foldersPage.cancelEditBtn.click();
  });
  it('Should delete folder', function () {
    $('#folderTreeName').waitForDisplayed({timeout: 20000});
    const lastFolder = foldersPage.getFolderByName(name);
    lastFolder.delete();
    expect(foldersPage.getFolderByName(name)).eq(null);
  });
})
;
