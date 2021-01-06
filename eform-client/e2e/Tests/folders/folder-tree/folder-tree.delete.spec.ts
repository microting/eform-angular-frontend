import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import foldersPage from '../../../Page objects/Folders.page';
import {generateRandmString} from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
let nameFolder = generateRandmString();

describe('Delete folder', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToFolderPage();
  });
  it('Should delete', function () {
    // Create
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);
    const rowNumParentsBeforeDelete = foldersPage.rowNum;
    foldersPage.getFolderByName(nameFolder).delete();
    const rowNumParentsAfterDelete = foldersPage.rowNum;
    expect(rowNumParentsBeforeDelete - 1, 'Folder was deleted incorrectly').equal(rowNumParentsAfterDelete);
  });
  it('Should not delete if cancel was clicked', function () {
    // Create
    nameFolder = generateRandmString();
    const description = generateRandmString();
    foldersPage.createNewFolder(nameFolder, description);

    // Delete
    const rowNumParentsBeforeDelete = foldersPage.rowNum;
    foldersPage.getFolderByName(nameFolder).delete(true);
    const rowNumParentsAfterCancelDelete = foldersPage.rowNum;
    expect(rowNumParentsBeforeDelete).equal(rowNumParentsAfterCancelDelete);
  });
  it('Should delete folder', function () {
    foldersPage.getFolderByName(nameFolder).delete();
  });
});
