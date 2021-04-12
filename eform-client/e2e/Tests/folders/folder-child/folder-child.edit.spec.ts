import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameFolder = generateRandmString();
const nameFolderChildren = generateRandmString();

describe('Create folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    $('#newFolderBtn').waitForDisplayed({ timeout: 20000 });
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
  });
  it('Create folder child', function () {
    const description = generateRandmString();
    const folder = foldersPage.getFolderByName(nameFolder);
    const rowCountBeforeCreation = foldersPage.rowChildrenNum;
    folder.createChild(nameFolderChildren, description);
    folder.expandChildren();
    const rowCountAfterCreation = foldersPage.rowChildrenNum;
    expect(
      rowCountBeforeCreation + 1,
      'Number of rows has not changed after creating new folder'
    ).equal(rowCountAfterCreation);
  });
  it('Should change name', function () {
    const newName = generateRandmString();
    const childFolderBeforeEdit = foldersPage.getFolderFromTree(
      foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    childFolderBeforeEdit.editFolderChild(newName, null);
    const childFolderAfterEdit = foldersPage.getFolderFromTree(
      foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    expect(childFolderAfterEdit.nameTree, 'Folder name has not changed').eq(
      newName
    );
  });
  it('Should change description', function () {
    const newDescription = generateRandmString();
    const childFolder = foldersPage.getFolderFromTree(
      foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    childFolder.editFolderChild(null, newDescription);
    const descriptionAfterEdit = childFolder.getDescription();
    expect(
      descriptionAfterEdit.find((x) => x.language === 'Danish').description,
      'Folder description has not changed',
      newDescription
    );
  });
  it('Should not change first name and description if cancel was clicked', function () {
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const rowParentsCountBeforeEditing = foldersPage.rowNumParents;
    const childFolderBeforeEdit = foldersPage.getFolderFromTree(
      foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    const childFolderBeforeEditDescription = childFolderBeforeEdit
      .getDescription()
      .find((x) => x.language === 'Danish').description;
    childFolderBeforeEdit.editFolderChild(newName, newDescription, true);
    const rowParentsCountAfterEditing = foldersPage.rowNumParents;
    const childFolderAfterEdit = foldersPage.getFolderFromTree(
      foldersPage.getFolderRowNumByName(nameFolder),
      1
    );
    const childFolderAfterEditDescription = childFolderAfterEdit
      .getDescription()
      .find((x) => x.language === 'Danish').description;
    expect(rowParentsCountBeforeEditing).equal(rowParentsCountAfterEditing);
    expect(childFolderAfterEdit.nameTree, 'Name has been changed').equal(
      childFolderBeforeEdit.nameTree
    );
    expect(
      childFolderAfterEditDescription,
      'Description has been changed'
    ).equal(childFolderBeforeEditDescription);
  });
  it('Should delete folder 1', function () {
    const rowCountBeforeDelete = foldersPage.rowChildrenNum;
    foldersPage
      .getFolderFromTree(foldersPage.getFolderRowNumByName(nameFolder), 1)
      .delete();
    const rowCountAfterDelete = foldersPage.rowChildrenNum;
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
  it('Should delete folder 2', function () {
    const rowCountBeforeDelete = foldersPage.rowNum;
    foldersPage.getFolderByName(nameFolder).delete();
    const rowCountAfterDelete = foldersPage.rowNum;
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
});
