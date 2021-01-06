import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let nameFolder = generateRandmString();

describe('Folder page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
    const description = generateRandmString();
    foldersPage.newFolderBtn.waitForDisplayed({timeout: 10000});
    foldersPage.createNewFolder(nameFolder, description);
  });
  it('Should change name', function () {
    let folder = foldersPage.getFolderByName(nameFolder);
    const lastFolderBeforeEditDescription = folder.getDescription();
    nameFolder = generateRandmString();
    folder.editFolder(nameFolder, null);

    folder = foldersPage.getFolderByName(nameFolder);
    const lastFolderAfterEditDescription = folder.getDescription();
    expect(folder.name, 'Name has been changed incorrectly').equal(nameFolder);
    expect(lastFolderAfterEditDescription,
      'Description has been changed after changing only first name').equal(lastFolderBeforeEditDescription);
  });
  it('Should change description', function () {
    const newDescription = generateRandmString();
    const folder = foldersPage.getFolderByName(nameFolder);
    folder.editFolder(null, newDescription);
    expect(folder.getDescription(), 'Description has been changed incorrectly').equal(newDescription);
    expect(folder.name, 'Name has been changed after changing only last name').equal(nameFolder);
  });
  it('Should not change first name and last name if cancel was clicked', function () {
    const rowNumBeforeEdit = foldersPage.rowNum;
    const folder = foldersPage.getFolderByName(nameFolder);
    const folderBeforeEditDescription = folder.getDescription();
    folder.editFolder(generateRandmString(), generateRandmString(), true);
    const rowNumAfterEdit = foldersPage.rowNum;
    expect(rowNumBeforeEdit, 'Number folder was change').equal(rowNumAfterEdit);
    const lastFolderPageAfterEdit = foldersPage.getFolderByName(nameFolder);
    const lastFolderPageAfterEditDescription = lastFolderPageAfterEdit.getDescription();
    expect(folder.name, 'Name has been changed').equal(lastFolderPageAfterEdit.name);
    expect(folderBeforeEditDescription, 'Description has been changed').equal(lastFolderPageAfterEditDescription);
  });
  it('Should delete folder', function () {
    foldersPage.getFolderByName(nameFolder).delete();
  });
});
