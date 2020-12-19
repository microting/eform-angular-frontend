import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;
const testTag = 'Test tag';

describe('Main page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should create eform', function () {
    myEformsPage.idSortBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000});
    const rowCountBeforeCreation = myEformsPage.rowNum;
    const newEformLabel = Guid.create().toString();
    myEformsPage.createNewEform(newEformLabel);
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000});
    elem.click(); // we remove the notification so that it does not interfere
    const eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).eq(newEformLabel);
    const rowCountAfterCreation = myEformsPage.rowNum;
    expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  });
  it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', function () {
    const eform = myEformsPage.getFirstMyEformsRowObj();
    eform.editTagsBtn.click();
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000});
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000});
    expect(elem.getText()).eq('Skabelonetiketter blev opdateret med succes');
    elem.click();
  });
  it('should create tag', function () {
    myEformsPage.createNewTag(testTag);
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000});
    expect(elem.getText()).eq(`Tag "${testTag}" oprettet med succes`);
    elem.click();
  });
  it('should add already prepared tag to eform', function () {
    let eform = myEformsPage.getFirstMyEformsRowObj();
    eform.addTag(testTag);
    browser.pause(500);
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.tags[0].getText()).eq(testTag);
  });
  it('should delete eForm tag from eform', function () {
    let eform = myEformsPage.getFirstMyEformsRowObj();
    eform.deleteTags([testTag]);
    const elem = $('#toast-container');
    elem.waitForDisplayed({timeout: 20000});
    elem.click();
    browser.pause(500);
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.tags.length).eq(0);
  });
  it('should delete tag from list', function () {
  myEformsPage.removeTag(testTag);
  const elem = $('#toast-container');
  elem.waitForDisplayed({timeout: 20000});
  expect(elem.getText()).eq(`Tag slettet korrekt`);
  });
  it('should delete existing eform', function () {
    const rowCountBeforeDelete = myEformsPage.rowNum;
    const eform = myEformsPage.getFirstMyEformsRowObj();
    eform.deleteEForm();
    browser.pause(500);
    const rowCountAfterDelete = myEformsPage.rowNum;
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
});
