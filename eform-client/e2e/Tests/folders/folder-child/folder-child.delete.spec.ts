import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameFolder = generateRandmString();

describe('Delete folder', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 40000 });
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
    // const rowParentsCountBeforeCreation = foldersPage.rowNumParents;
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    const folder = foldersPage.getFolderByName(nameFolder);
    folder.createChild(childName, childDescription);
    folder.expandChildren();
  });
  it('Delete folder child with name and description', async () => {
    const rowCountBeforeDelete = foldersPage.rowChildrenNum;
    foldersPage
      .getFolderFromTree(foldersPage.getFolderRowNumByName(nameFolder), 1)
      .delete();
    const rowCountAfterDelete = foldersPage.rowChildrenNum;
    expect(
      rowCountAfterDelete,
      "Number of rows hasn't changed after creating new folder"
    ).equal(rowCountBeforeDelete - 1);
  });
  it('If cancel was clicked', async () => {
    const childName = generateRandmString();
    const childDescription = generateRandmString();
    foldersPage
      .getFolderByName(nameFolder)
      .createChild(childName, childDescription);
    const rowCountBeforeDelete = foldersPage.rowChildrenNum;
    foldersPage
      .getFolderFromTree(foldersPage.getFolderRowNumByName(nameFolder), 1)
      .delete(true);
    const rowCountAfterDelete = foldersPage.rowChildrenNum;
    expect(rowCountBeforeDelete, 'Folder was deleted', rowCountAfterDelete);
  });
  it('Should delete folder 1', async () => {
    const rowCountBeforeDelete = foldersPage.rowChildrenNum;
    foldersPage
      .getFolderFromTree(foldersPage.getFolderRowNumByName(nameFolder), 1)
      .delete();
    const rowCountAfterDelete = foldersPage.rowChildrenNum;
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
  it('Should delete folder 2', async () => {
    const rowCountBeforeDelete = foldersPage.rowNum;
    foldersPage.getFolderByName(nameFolder).delete();
    const rowCountAfterDelete = foldersPage.rowNum;
    expect(rowCountBeforeDelete - 1, 'Folder not deleted', rowCountAfterDelete);
  });
});
