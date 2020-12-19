import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;
const testTag1 = 'Test tag';
const testTag2 = 'Tag for test';
const countCreateEForm = 3;
let countRowsBeforeFiltering = 0;
describe('My eforms', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should be able to filter by 1 word in label input', function () {
    myEformsPage.idSortBtn.click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    const namesEForms = new Array<string>();
    for (let i = 0; i < countCreateEForm; i++) {
      const newEForm = generateRandmString();
      myEformsPage.createNewEform(newEForm);
      namesEForms.push(newEForm);
    }
    const nameEFormForFiltering = namesEForms[1];
    countRowsBeforeFiltering = myEformsPage.rowNum;
    myEformsPage.eformFilter.setValue(nameEFormForFiltering);
    spinnerAnimation.waitForDisplayed({timeout: 50000});
    browser.pause(2000);
    const eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).equal(nameEFormForFiltering);
  });
  it('should be able to see all eforms by leaving label input empty', function () {
    browser.pause(1000);
    myEformsPage.eformFilter.click();
    browser.keys(['Control', 'a']);
    browser.keys( 'Control');
    browser.keys('Delete');
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 50000});
    expect(myEformsPage.rowNum).equal(countRowsBeforeFiltering);
  });
  it('should be able to filter using 1 tag', function () {
    myEformsPage.createNewTag(testTag1);
    myEformsPage.createNewTag(testTag2);
    myEformsPage.getEformRowObj(1).addTag(testTag2);
    const eform = myEformsPage.getEformRowObj(2);
    eform.addTag(testTag1);
    browser.pause(1000);
    myEformsPage.enterTagFilter(testTag1);
    browser.pause(500);
    expect(eform.eFormName).eq(myEformsPage.getFirstMyEformsRowObj().eFormName);
  });
  it('should be able to filter using several tags', function () {
    myEformsPage.enterTagFilter(testTag2);
    browser.pause(1000);
    expect(myEformsPage.rowNum).eq(2);
  });

  it('should delete eform', function () {
    myEformsPage.enterTagFilter(testTag1);
    myEformsPage.enterTagFilter(testTag2);
    myEformsPage.removeTag(testTag1);
    myEformsPage.removeTag(testTag2);
    const rowCountBeforeDelete = myEformsPage.rowNum;
    for (let i = 0; i < countCreateEForm; i++) {
      myEformsPage.getFirstMyEformsRowObj().deleteEForm();
      browser.pause(1000);
    }
    const rowCountAfterDelete = myEformsPage.rowNum;
    expect(rowCountBeforeDelete - countCreateEForm).eq(rowCountAfterDelete);
  });
});
