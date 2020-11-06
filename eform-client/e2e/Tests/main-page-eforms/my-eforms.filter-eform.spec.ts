import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;
describe('My eforms', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });

  it('should be able to filter by 1 word in label input', function () {
    const neweForm = generateRandmString();
    myEformsPage.createNewEform(neweForm);
    myEformsPage.eformFilter.setValue(neweForm);
    const myeForm = myEformsPage.getFirstMyEformsRowObj();
    expect(myeForm.eFormName).equal(neweForm);

  });
  it('should be able to see all eforms by leaving label input empty', function () {

  });
  it('should be able to filter using 1 tag', function () {

  });
  it('should be able to filter using several tags', function () {

  });

  it('should delete eform', function () {
    let eform = myEformsPage.getFirstMyEformsRowObj();
    const tagsTexts = eform.tags.map(el => {
      return el.getText();
    });
    eform.deleteBtn.click();
    $('#eFormDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    // browser.pause(7000);
    $$('.btn-danger')[2].click();
    eform = myEformsPage.getFirstMyEformsRowObj();
    expect(eform.id === null);
  });
});
