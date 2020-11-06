import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage, {FoldersRowObject} from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Create folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    foldersPage.createNewFolder(name, description);
  });
  it('Create folder child with name and description', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const rowCountBeforeCreation = foldersPage.rowNum;
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    foldersPage.createFolderChild(rowParentsCountBeforeCreation, name, description);
    const rowCountAfterCreation = foldersPage.rowNum;
    const rowParentsCountAfterCreation = foldersPage.rowNumParents;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountBeforeCreation + 1);
    expect(rowParentsCountAfterCreation, 'Number os parent folder has changed', rowParentsCountBeforeCreation);
  });
});
describe('Folder should not be created', function() {
  afterEach(function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Create folder child with name only', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToFolderPage();
    const name = Guid.create().toString();
    // const rowCountBeforeCreation = foldersPage.rowNum;
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    $$('#folderTreeName')[rowParentsCountBeforeCreation - 1].click();
    $('#createFolderChildBtn').click();
    foldersPage.createNameInput.waitForDisplayed({timeout: 20000});
    foldersPage.createNameInput.setValue(name);
    expect(foldersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new folder is active when only name is provided').equal(false);
  });
  it('If cancel was clicked', function () {
    const rowCountBeforeCreation = foldersPage.rowNum;
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    $$('#folderTreeName')[rowParentsCountBeforeCreation - 1].click();
    $('#createFolderChildBtn').click();
    $('#name').waitForDisplayed({timeout: 10000});
    foldersPage.cancelCreateBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 10000});
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
  });
  it('Should delete folder 1', function () {
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
  it('Should delete folder 2', function () {
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
