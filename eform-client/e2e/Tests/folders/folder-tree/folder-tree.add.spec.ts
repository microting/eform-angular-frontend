import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Create folder in tree', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
  });
  it('With name and with description', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage.createNewFolder(name, description);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeCreation + 1);
    const lastFolder: FoldersRowObject = foldersPage.getFolder(foldersPage.rowNum);
    expect(lastFolder.name, 'Name of created user is incorrect').equal(name);
    expect(lastFolder.description, 'Description of created folder is incorrect').equal(description);
  });
});
describe('Folder should not be created', function () {
  afterEach(function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
  });
  it('With name only', function () {
    const name = generateRandmString();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    $('#newFolderBtn').waitForClickable({timeout: 20000});
    foldersPage.newFolderBtn.click();
    $('#name').waitForDisplayed({timeout: 10000});
    foldersPage.createNameInput.setValue(name);
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
  });
  it('If cancel was clicked', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    foldersPage.newFolderBtn.click();
    $('#name').waitForDisplayed({timeout: 10000});
    foldersPage.cancelCreateBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 10000});
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
  });
  it('Should delete folder', function () {
    // Create
    myEformsPage.Navbar.goToFolderPage();
    $('#folderId').waitForDisplayed({timeout: 20000});
    const lastFolder = foldersPage.getFolder(1);
    lastFolder.deleteBtn.waitForDisplayed({timeout: 5000});
    lastFolder.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    foldersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
});
