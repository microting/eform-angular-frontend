import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;
const testTag1 = 'Test tag';
const testTag2 = 'Tag for test';
const countCreateEForm = 3;
let countRowsBeforeFiltering = 0;
const namesEForms = new Array<string>();
describe('My eforms', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should be able to filter by 1 word in label input', function () {
    myEformsPage.idSortBtn.click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    for (let i = 0; i < countCreateEForm; i++) {
      const newEForm = generateRandmString();
      myEformsPage.createNewEform(newEForm);
      namesEForms.push(newEForm);
    }
    const nameEFormForFiltering = namesEForms[1];
    countRowsBeforeFiltering = myEformsPage.rowNum;
    myEformsPage.eformFilter.setValue(nameEFormForFiltering);
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    browser.pause(2000);
    const eform = myEformsPage.getEformsRowObjByNameEForm(
      nameEFormForFiltering
    );
    expect(eform).not.equal(null);
  });
  it('should be able to see all eforms by leaving label input empty', function () {
    myEformsPage.eformFilter.click();
    browser.keys(['Control', 'a', 'Control', 'Delete']);
    $('#spinner-animation').waitForDisplayed({ timeout: 50000, reverse: true });
    browser.pause(2000);
    expect(myEformsPage.rowNum).equal(countRowsBeforeFiltering);
  });
  it('should be able to filter using 1 tag', function () {
    myEformsPage.createNewTags([testTag1, testTag2]);
    myEformsPage.getEformsRowObjByNameEForm(namesEForms[1]).addTag(testTag2);
    const eform = myEformsPage.getEformsRowObjByNameEForm(namesEForms[2]);
    eform.addTag(testTag1);
    myEformsPage.enterTagFilter(testTag1);
    expect(eform.eFormName).eq(myEformsPage.getFirstMyEformsRowObj().eFormName);
  });
  it('should be able to filter using several tags', function () {
    myEformsPage.enterTagFilter(testTag2);
    expect(myEformsPage.rowNum).eq(2);
  });
  after(function () {
    // Commented until we have async testing implemented.
    // myEformsPage.enterTagFilter(testTag1);
    // myEformsPage.enterTagFilter(testTag2);
    // myEformsPage.removeTags([testTag1, testTag2]);
    // for (let i = 0; i < namesEForms.length; i++) {
    //   myEformsPage.getEformsRowObjByNameEForm(namesEForms[i]).deleteEForm();
    //   browser.pause(500);
    // }
  });
});
