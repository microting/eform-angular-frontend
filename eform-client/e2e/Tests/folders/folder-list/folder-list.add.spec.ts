import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const folderName = generateRandmString();

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
    foldersPage.createNewFolder(folderName, description);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeCreation + 1);
    const folder = foldersPage.getFolderByName(folderName);
    expect(folder.name, 'Name of created user is incorrect').equal(folderName);
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
  after('should delete folder', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.getFolderByName(folderName).delete();
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountBeforeCreation - 1, 'Folder not delete').equal(rowCountAfterCreation);
  });
});
