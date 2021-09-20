import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let name = generateRandmString();

describe('Folder page', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    const description = generateRandmString();
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 10000 });
    foldersPage.createNewFolder(name, description);
  });
  it('Should change name', async () => {
    const folderBeforeEdit = foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = folderBeforeEdit
      .getDescription()
      .find((x) => x.language === 'Danish').description;
    name = generateRandmString();
    folderBeforeEdit.editFolder(name);
    const folderAfterEdit = foldersPage.getFolderByName(name);
    expect(
      folderAfterEdit.name,
      'Name has been changed after changing only last name'
    ).equal(name);
    expect(
      folderAfterEdit.getDescription().find((x) => x.language === 'Danish')
        .description,
      'Description has been changed incorrectly'
    ).equal(descriptionBeforeEdit);
  });
  it('Should change description', async () => {
    const newDescription = generateRandmString();
    $('#folderTreeName').waitForDisplayed({ timeout: 40000 });
    const lastFolderBeforeEdit = foldersPage.getFolderByName(name);
    lastFolderBeforeEdit.editFolder(null, newDescription);
    foldersPage.newFolderBtn.waitForDisplayed({ timeout: 40000 });
    const folder = foldersPage.getFolderByName(name);
    expect(
      folder.name,
      'Name has been changed after changing only last name'
    ).equal(lastFolderBeforeEdit.name);
    expect(
      folder.getDescription().find((x) => x.language === 'Danish').description,
      'Description has been changed incorrectly'
    ).equal(newDescription);
  });
  it('Should not change name and description if cancel was clicked', async () => {
    const folderTreeName = $('#folderTreeName');
    folderTreeName.waitForDisplayed({ timeout: 40000 });
    const newName = generateRandmString();
    const newDescription = generateRandmString();
    const lastFolderPageBeforeEdit = foldersPage.getFolderByName(name);
    const descriptionBeforeEdit = lastFolderPageBeforeEdit
      .getDescription()
      .find((x) => x.language === 'Danish').description;
    lastFolderPageBeforeEdit.editFolder(newName, newDescription, true);
    const lastFolderPageAfterEdit = foldersPage.getFolderByName(name);
    expect(lastFolderPageAfterEdit.name, 'Name has been changed').equal(
      lastFolderPageAfterEdit.name
    );
    expect(
      lastFolderPageAfterEdit
        .getDescription()
        .find((x) => x.language === 'Danish').description,
      'Description has been changed'
    ).equal(descriptionBeforeEdit);
  });
  after(async () => {
    const lastFolder = foldersPage.getFolderByName(name);
    lastFolder.delete();
    expect(foldersPage.getFolderByName(name)).eq(null);
  });
});
