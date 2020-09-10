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
  it('Create folder child and change name', function () {
    const name = Guid.create().toString();
    const description = Guid.create().toString();
    const rowCountBeforeCreation = foldersPage.rowNum;
    const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    foldersPage.createFolderChild(rowParentsCountBeforeCreation, name, description);
    const rowCountAfterCreation = foldersPage.rowNum;
    const rowParentsCountAfterCreation = foldersPage.rowNumParents;
    const lastFolderAfterEdit = foldersPage.getFolder(rowCountAfterCreation);
    $$('#folderTreeOpenClose')[rowParentsCountAfterCreation - 1].waitForDisplayed({timeout: 20000});
    $$('#folderTreeOpenClose')[rowParentsCountAfterCreation - 1].click();
    browser.pause(1000);
    $$('#folderTreeName')[rowParentsCountAfterCreation].waitForDisplayed({timeout: 20000});
    $$('#folderTreeName')[rowParentsCountAfterCreation].click();
    const newName = Guid.create().toString();
    const childFolder = foldersPage.getFolderFromTree(rowParentsCountAfterCreation);
    foldersPage.editFolderChild(childFolder, newName, null);
    expect(rowCountBeforeCreation, 'Number of rows hasn\'t changed after creating new folder').equal(rowCountAfterCreation - 1);
    expect(lastFolderAfterEdit.name, 'Folder name has not changed', newName);
  });
  it('Should change description', function () {
    const newDescription = Guid.create().toString();
    const rowParentsCountBeforeEditing = foldersPage.rowNumParents;
    const childFolder = foldersPage.getFolderFromTree(rowParentsCountBeforeEditing);
    foldersPage.editFolderChild(childFolder, null, newDescription);
    expect(childFolder.descriptionTree, 'Folder description has not changed', newDescription);
  });
  it('Should not change first name and last name if cancel was clicked', function () {
    const newName = Guid.create().toString();
    const newDescription = Guid.create().toString();
    const rowParentsCountBeforeEditing = foldersPage.rowNumParents;
    const childFolderBeforeEdit = foldersPage.getFolderFromTree(rowParentsCountBeforeEditing);
    childFolderBeforeEdit.editTreeBtn.click();
    $('#editNameInput').waitForDisplayed({timeout: 10000});
    foldersPage.editNameInput.click();
    foldersPage.editNameInput.clearValue();
    foldersPage.editNameInput.setValue(newName);
    foldersPage.editDescriptionInput.click();
    foldersPage.editDescriptionInput.clearValue();
    foldersPage.editDescriptionInput.setValue(newDescription);
    foldersPage.cancelEditBtn.click();
    $('#newFolderBtn').waitForDisplayed({timeout: 20000});
    const rowParentsCountAfterEditing = foldersPage.rowNumParents;
    const childFolderAfterEdit = foldersPage.getFolderFromTree(rowParentsCountAfterEditing);
    expect(rowParentsCountBeforeEditing).equal(rowParentsCountAfterEditing);
    expect(childFolderAfterEdit.nameTree, 'Name has been changed').equal(childFolderBeforeEdit.nameTree);
    expect(childFolderAfterEdit.descriptionTree, 'Description has been changed').equal(childFolderBeforeEdit.descriptionTree);
  });
});

