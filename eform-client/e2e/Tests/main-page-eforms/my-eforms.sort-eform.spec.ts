import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;

describe('Main page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should be able to sort by ID', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    myEformsPage.idSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const idListBefore = $$('#eform-id').map(item => {
      return item.getText();
    });
    myEformsPage.idSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const idListAfter = $$('#eform-id').map(item => {
      return item.getText();
    });
    expect(idListBefore).deep.equal(idListAfter.reverse());
  });
  it('should be able to sort by "Created at"', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    myEformsPage.createdAtSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const createdAtListBefore = $$('#eform-created-at').map(item => {
      return new Date(item.getText());
    });
    myEformsPage.createdAtSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const createdAtListAfter = $$('#eform-created-at').map(item => {
      return new Date(item.getText());
    });
    expect(createdAtListBefore).deep.equal(createdAtListAfter.reverse());
  });
  it('should be able to sort by "Name eForm"', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    myEformsPage.eformNameSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const nameEformListBefore = $$('#eform-label').map(item => {
      return item.getText();
    });
    myEformsPage.eformNameSortBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    const nameEformListAfter = $$('#eform-label').map(item => {
      return item.getText();
    });
    expect(nameEformListBefore).deep.equal(nameEformListAfter.reverse());
  });

});
