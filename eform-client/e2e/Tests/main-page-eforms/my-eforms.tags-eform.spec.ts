import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;
const testTag = 'Test tag';
const newEformLabel = generateRandmString();
describe('Main page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should create eform', function () {
    myEformsPage.idSortBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const rowCountBeforeCreation = myEformsPage.rowNum;
    myEformsPage.createNewEform(newEformLabel);
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.eFormName).eq(newEformLabel);
    const rowCountAfterCreation = myEformsPage.rowNum;
    expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  });
  it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', function () {
    const elem = $('#toast-container');
    const eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    elem.waitForDisplayed({timeout: 20000, reverse: true});
    eform.editTagsBtn.click();
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    elem.waitForDisplayed({timeout: 20000});
    expect(elem.getText()).eq('Skabelonetiketter blev opdateret med succes');
  });
  it('should create tag', function () {
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000, reverse: true});
    myEformsPage.createNewTag(testTag);
    elem.waitForDisplayed({timeout: 20000});
    expect(elem.getText()).eq(`Tag "${testTag}" oprettet med succes`);
  });
  it('should add already prepared tag to eform', function () {
    myEformsPage.getEformsRowObjByNameEForm(newEformLabel).addTag(testTag);
    browser.pause(500);
    expect(myEformsPage.getEformsRowObjByNameEForm(newEformLabel).tags[0].getText()).eq(testTag);
  });
  it('should delete eForm tag from eform', function () {
    let eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000, reverse: true});
    eform.deleteTags([testTag]);
    elem.waitForDisplayed({timeout: 20000});
    elem.click();
    browser.pause(500);
    eform = myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).eq(0);
  });
  it('should delete tag from list', function () {
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000, reverse: true});
    myEformsPage.removeTag(testTag);
    elem.waitForDisplayed({timeout: 20000});
    expect(elem.getText()).eq(`Tag slettet korrekt`);
  });
  it('should delete existing eform', function () {
    const rowCountBeforeDelete = myEformsPage.rowNum;
    myEformsPage.getEformsRowObjByNameEForm(newEformLabel).deleteEForm();
    browser.pause(500);
    const rowCountAfterDelete = myEformsPage.rowNum;
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
});
