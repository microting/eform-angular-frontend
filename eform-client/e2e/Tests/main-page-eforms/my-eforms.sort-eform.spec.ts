import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import { testSorting } from '../../Helpers/helper-functions';

describe('Main page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
  });
  it('should be able to sort by ID', function () {
    testSorting(myEformsPage.idSortBtn, '#eform-id', 'ID');
  });
  it('should be able to sort by "Created at"', function () {
    testSorting(
      myEformsPage.createdAtSortBtn,
      '#eform-created-at',
      'Created at'
    );
  });
  it('should be able to sort by "Name eForm"', function () {
    testSorting(myEformsPage.eformNameSortBtn, '#eform-label', 'Name eForm');
  });
});
