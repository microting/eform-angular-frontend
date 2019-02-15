import loginPage from '../../Page objects/Login.page';
import customersPage, {CustomersRowObject} from '../../Page objects/Customers/Customers.page';
import customersImportPage from '../../Page objects/Customers/CustomersImport.page';

const expect = require('chai').expect;

describe('Customers plugin import page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    customersPage.goToCustomersPage();
  });
  it('should import customers list', function () {

  });
  it('should not import customers', function () {

  });
});
