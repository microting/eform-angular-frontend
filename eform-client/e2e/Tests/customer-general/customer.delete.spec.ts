import loginPage from '../../Page objects/Login.page';
import {generateRandmString} from '../../Helpers/helper-functions';
import customersPage, {CustomersRowObject} from '../../Page objects/Customers/Customers.page';
import customersModalPage from '../../Page objects/Customers/CustomersModal.page';

const expect = require('chai').expect;

describe('Customer modal', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    customersPage.goToCustomersPage();
  });
  it('should delete customer', function () {
    const rowBeforeDeletion = customersPage.rowNum;
    const lastCustomer: CustomersRowObject = customersPage.getCustomer(rowBeforeDeletion);
    lastCustomer.deleteBtn.waitForVisible(3000);
    lastCustomer.deleteBtn.click();
    browser.pause(3000);
    customersModalPage.deleteCustomer();
    const rowAfterDeletion = customersPage.rowNum;
    expect(rowBeforeDeletion, 'Number of rows hasn\'t changed after deleting customer').equal(rowAfterDeletion + 1);
  });
  it('should not delete customer if cancel was clicked', function () {
    const lastCustomer: CustomersRowObject = customersPage.getCustomer(customersPage.rowNum);
    lastCustomer.deleteBtn.waitForVisible(3000);
    lastCustomer.deleteBtn.leftClick();
    browser.pause(3000);
    customersModalPage.cancelDeleteBtn.leftClick();
  });
});
