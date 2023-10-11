import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let name = generateRandmString();

describe('Folder page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToFolderPage();
    const description = generateRandmString();
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 10000 });
    await foldersPage.createNewFolder(name, description);
  });
  it('Should change name', async () => {
    const folderBeforeEdit = await foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = (await folderBeforeEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    name = generateRandmString();
    await folderBeforeEdit.editFolder(name);
    console.log(name);
    const folderAfterEdit = await foldersPage.getFolderByName(name);
    expect(
      folderAfterEdit.name,
      'Name has been changed after changing only last name'
    ).equal(name);
    expect(
      (await folderAfterEdit.getDescription()).find((x) => x.language === 'Dansk')
        .description,
      'Description has been changed incorrectly'
    ).equal(descriptionBeforeEdit);
  });
  it('Should change description', async () => {
    const newDescription = generateRandmString();
    await (await $('.folder-tree-name')).waitForDisplayed({ timeout: 40000 });
    const lastFolderBeforeEdit = await foldersPage.getFolderByName(name);
    await lastFolderBeforeEdit.editFolder(null, newDescription);
    await (await foldersPage.newFolderBtn()).waitForDisplayed({ timeout: 40000 });
    const folder = await foldersPage.getFolderByName(name);
    expect(
      folder.name,
      'Name has been changed after changing only last name'
    ).equal(lastFolderBeforeEdit.name);
    expect(
      (await folder.getDescription()).find((x) => x.language === 'Dansk').description,
      'Description has been changed incorrectly'
    ).equal(newDescription);
  });
  it('Should not change name and description if cancel was clicked', async () => {
    const folderTreeName = await $('.folder-tree-name');
    await folderTreeName.waitForDisplayed({ timeout: 40000 });
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const lastFolderPageBeforeEdit = await foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = (await lastFolderPageBeforeEdit
      .getDescription())
      .find((x) => x.language === 'Dansk').description;
    await lastFolderPageBeforeEdit.editFolder(newName, newDescription, true);
    const lastFolderPageAfterEdit = await foldersPage.getFolderByName(name);
    expect(lastFolderPageAfterEdit.name, 'Name has been changed').equal(
      lastFolderPageAfterEdit.name
    );
    expect(
      (await lastFolderPageAfterEdit
        .getDescription())
        .find((x) => x.language === 'Dansk').description,
      'Description has been changed'
    ).equal(descriptionBeforeEdit);
  });
  after(async () => {
    const lastFolder = await foldersPage.getFolderByName(name);
    await lastFolder.delete();
    expect(await foldersPage.getFolderByName(name)).eq(null);
  });
});
