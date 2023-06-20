import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import { testSorting } from '../helper-functions';

describe('Main page', function () {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  // it('should be able to sort by ID', () => {
  //   testSorting(myEformsPage.idSortBtn(), '#eform-id', 'ID');
  // });
  // it('should be able to sort by "Created at"', () => {
  //   testSorting(
  //     myEformsPage.createdAtSortBtn(),
  //     '#eform-created-at',
  //     'Created at'
  //   );
  // });
  // it('should be able to sort by "Name eForm"', () => {
  //   testSorting(myEformsPage.eformNameSortBtn(), '#eform-label', 'Name eForm');
  // });
});
