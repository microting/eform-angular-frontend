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
});
describe('Folder should not be created', function () {
  it('With name only', function () {
    const name = generateRandmString();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
    foldersPage.newFolderBtn.click();
    foldersPage.createNameInput.waitForDisplayed({timeout: 10000});
    foldersPage.createNameInput.setValue(name);
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
    foldersPage.cancelCreateBtn.click();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 20000});
  });
  it('If cancel was clicked', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.createNewFolder(generateRandmString(), generateRandmString(), true);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
  });
  after('Should delete folder', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.getFolderByName(folderName).delete();
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountBeforeCreation - 1, 'Folder not delete').equal(rowCountAfterCreation);
  });
});
