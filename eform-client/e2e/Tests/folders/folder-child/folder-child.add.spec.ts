import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

import {expect} from 'chai';
const nameFolder = generateRandmString();

describe('Create folder', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
    const description = generateRandmString();
    await foldersPage.createNewFolder(nameFolder, description);
  });
  it('Create folder child with name and description', async () => {
    const name = generateRandmString();
    const description = generateRandmString();
    const rowCountBeforeCreation = await foldersPage.rowChildrenNum();
    const folder = await foldersPage.getFolderByName(nameFolder);
    await folder.createChild(name, description);
    await folder.expandChildren();
    const rowCountAfterCreation = await foldersPage.rowChildrenNum();
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
  // it('If cancel was clicked', async () => {
  //   const rowCountBeforeCreation = await foldersPage.rowNum();
  //   await (await foldersPage
  //     .getFolderByName(nameFolder))
  //     .createChild(generateRandmString(), generateRandmString(), true);
  //   const rowCountAfterCreation = await foldersPage.rowNum();
  //   expect(
  //     rowCountAfterCreation,
  //     'Number of rows has changed after cancel'
  //   ).equal(rowCountBeforeCreation);
  // });
  // it('Should delete folder 1', async () => {
  //   const rowCountBeforeDelete = await foldersPage.rowChildrenNum();
  //   await foldersPage
  //     .getFolderFromTree(await foldersPage.getFolderRowNumByName(nameFolder), 1)
  //     .delete();
  //   const rowCountAfterDelete = await foldersPage.rowChildrenNum();
  //   expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  // });
  // it('Should delete folder 2', async () => {
  //   const rowCountBeforeDelete = await foldersPage.rowNum();
  //   await (await foldersPage.getFolderByName(nameFolder)).delete();
  //   const rowCountAfterDelete = await foldersPage.rowNum();
  //   expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  // });
  after('should delete folders', async () => {
    const rowCountBeforeCreation = await foldersPage.rowNum();
    //for (let i = 0; i < rowCountBeforeCreation; i++) {
      //console.log(i);
      const folder = await foldersPage.getFolder(1);
      await folder.delete();
      await browser.pause(500);
    //}
    const rowCountAfterCreation = await foldersPage.rowNum();
    expect(
      0,
      'Folder not delete'
    ).equal(rowCountAfterCreation);
  });
});
