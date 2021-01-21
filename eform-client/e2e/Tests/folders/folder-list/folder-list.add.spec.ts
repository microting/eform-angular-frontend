import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const folderName = [generateRandmString(), generateRandmString(), generateRandmString(), generateRandmString(), generateRandmString()];

describe('Create folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  });
  it('With name and with description', function () {
    const description = generateRandmString();
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.createNewFolder(folderName[0], description);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeCreation + 1);
    const folder = foldersPage.getFolderByName(folderName[0]);
    expect(folder.name, 'Name of created user is incorrect').equal(folderName[0]);
    expect(folder.getDescription(), 'Description of created folder is incorrect').equal(description);
  });
  it('should not be created without description', function () {
    const name = generateRandmString();
    foldersPage.openCreateFolder(name);
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created without name', function () {
    const description = generateRandmString();
    foldersPage.openCreateFolder(null, description);
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created without name and description', function () {
    foldersPage.openCreateFolder();
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created if the description has only spaces', function () {
    foldersPage.openCreateFolder(generateRandmString(), '    ');
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created if the name has only spaces', function () {
    foldersPage.openCreateFolder('    ', generateRandmString());
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created if the name and description has only spaces', function () {
    foldersPage.openCreateFolder('    ', '  ');
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.closeCreateFolder(true);
  });
  it('should not be created if cancel was clicked', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.createNewFolder(generateRandmString(), generateRandmString(), true);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
  });
  it('should create new folder with bold description', function () {
    foldersPage.openCreateFolder(folderName[1]);
    const description = generateRandmString();
    foldersPage.createDescriptionInput.addValue(description);
    browser.keys(['Control', 'KeyA', 'Control']);
    foldersPage.createDescriptionInputPellBold.click();
    foldersPage.closeCreateFolder();
    const foldersRowObject = foldersPage.getFolderByName(folderName[1]);
    foldersRowObject.openEditModal();
    expect(foldersPage.editDescriptionInput.getHTML(false), 'save description incorrect').eq(`<b>${description}</b>`);
    foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with underline description', function () {
    foldersPage.openCreateFolder(folderName[2]);
    const description = generateRandmString();
    foldersPage.createDescriptionInput.addValue(description);
    browser.keys(['Control', 'KeyA', 'Control']);
    foldersPage.createDescriptionInputPellUnderline.click();
    foldersPage.closeCreateFolder();
    const foldersRowObject = foldersPage.getFolderByName(folderName[2]);
    foldersRowObject.openEditModal();
    expect(foldersPage.editDescriptionInput.getHTML(false), 'save description incorrect').eq(`<u>${description}</u>`);
    foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with italic description', function () {
    foldersPage.openCreateFolder(folderName[3]);
    const description = generateRandmString();
    foldersPage.createDescriptionInput.addValue(description);
    browser.keys(['Control', 'KeyA', 'Control']);
    foldersPage.createDescriptionInputPellItalic.click();
    foldersPage.closeCreateFolder();
    const foldersRowObject = foldersPage.getFolderByName(folderName[3]);
    foldersRowObject.openEditModal();
    expect(foldersPage.editDescriptionInput.getHTML(false), 'save description incorrect').eq(`<i>${description}</i>`);
    foldersRowObject.closeEditModal(true);
  });
  it('should create new folder with strike-through description', function () {
    foldersPage.openCreateFolder(folderName[4]);
    const description = generateRandmString();
    foldersPage.createDescriptionInput.addValue(description);
    browser.keys(['Control', 'KeyA', 'Control']);
    foldersPage.createDescriptionInputPellStrikeThrough.click();
    foldersPage.closeCreateFolder();
    const foldersRowObject = foldersPage.getFolderByName(folderName[4]);
    foldersRowObject.openEditModal();
    expect(foldersPage.editDescriptionInput.getHTML(false), 'save description incorrect').eq(`<strike>${description}</strike>`);
    foldersRowObject.closeEditModal(true);
  });
  after('should delete folders', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    for (let i = 0; i < folderName.length; i++) {
      foldersPage.getFolderByName(folderName[i]).delete();
    }
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountBeforeCreation - folderName.length, 'Folder not delete').equal(rowCountAfterCreation);
  });
});
