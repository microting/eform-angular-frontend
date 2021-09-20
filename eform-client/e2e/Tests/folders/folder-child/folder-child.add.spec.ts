import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameFolder = generateRandmString();

describe('Create folder', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 40000 });
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
  });
  it('Create folder child with name and description', async () => {
    const name = generateRandmString();
    const description = generateRandmString();
    const rowCountBeforeCreation = foldersPage.rowChildrenNum;
    const folder = foldersPage.getFolderByName(nameFolder);
    folder.createChild(name, description);
    folder.expandChildren();
    const rowCountAfterCreation = foldersPage.rowChildrenNum;
    expect(
      rowCountBeforeCreation + 1,
      `Number of rows hasn't changed after creating new folder`
    ).equal(rowCountAfterCreation);
  });
  // it('Create folder child with name only', async () => {
  //   const parentFolder = foldersPage.getFolderByName(nameFolder);
  //   // parentFolder.expandChildren();
  //   parentFolder.createFolderChildBtn.click();
  //   foldersPage.createNameInput.waitForDisplayed({ timeout: 40000 });
  //   foldersPage.createNameInput.setValue(generateRandmString());
  //   expect(
  //     foldersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new folder is active when only name is provided'
  //   ).equal(false);
  //   foldersPage.cancelCreateBtn.click();
  // });
  it('If cancel was clicked', async () => {
    const rowCountBeforeCreation = foldersPage.rowNum;
    foldersPage
      .getFolderByName(nameFolder)
      .createChild(generateRandmString(), generateRandmString(), true);
    const rowCountAfterCreation = foldersPage.rowNum;
    expect(
      rowCountAfterCreation,
      'Number of rows has changed after cancel'
    ).equal(rowCountBeforeCreation);
  });
  it('Should delete folder 1', async () => {
    const rowCountBeforeDelete = foldersPage.rowChildrenNum;
    foldersPage
      .getFolderFromTree(foldersPage.getFolderRowNumByName(nameFolder), 1)
      .delete();
    const rowCountAfterDelete = foldersPage.rowChildrenNum;
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
  it('Should delete folder 2', async () => {
    const rowCountBeforeDelete = foldersPage.rowNum;
    foldersPage.getFolderByName(nameFolder).delete();
    const rowCountAfterDelete = foldersPage.rowNum;
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
});
