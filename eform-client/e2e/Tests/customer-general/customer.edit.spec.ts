import loginPage from '../../Page objects/Login.page';
import {generateRandmString} from '../../Helpers/helper-functions';
import customersPage, {CustomersRowObject} from '../../Page objects/Customers/Customers.page';
import customersModalPage from '../../Page objects/Customers/CustomersModal.page';
import {Guid} from "guid-typescript";

const expect = require('chai').expect;

describe('Customers plugin page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    customersPage.goToCustomersPage();
  });
  it('should update customer with all fields', function () {
    const lastCustomerBeforeEdit = customersPage.getCustomer(customersPage.rowNum);
    lastCustomerBeforeEdit.editBtn.waitForVisible(3000);
    lastCustomerBeforeEdit.editBtn.click();
    browser.pause(3000);
    const customerObject = {
      createdBy: Guid.create().toString(),
      customerNo: Guid.create().toString(),
      contactPerson: Guid.create().toString(),
      companyName: Guid.create().toString(),
      companyAddress: Guid.create().toString(),
      zipCode: Guid.create().toString(),
      cityName: Guid.create().toString(),
      phone: Guid.create().toString(),
      email: Guid.create().toString()
    };
    customersModalPage.updateCustomer(customerObject);
    const lastCustomerAfterEdit = customersPage.getCustomer(customersPage.rowNum);
    expect(lastCustomerAfterEdit.createdBy, 'Created by of updated customer is incorrect').equal(customerObject.createdBy);
    expect(lastCustomerAfterEdit.customerNo, 'Customer number of updated customer is incorrect').equal(customerObject.customerNo);
    expect(lastCustomerAfterEdit.contactPerson, 'Contact person of updated customer is incorrect').equal(customerObject.contactPerson);
    expect(lastCustomerAfterEdit.companyName, 'Company name of updated customer is incorrect').equal(customerObject.companyName);
    expect(lastCustomerAfterEdit.companyAddress, 'Company address of updated customer is incorrect').equal(customerObject.companyAddress);
    expect(lastCustomerAfterEdit.zipCode, 'Zip code of updated customer is incorrect').equal(customerObject.zipCode);
    expect(lastCustomerAfterEdit.cityName, 'City name of updated customer is incorrect').equal(customerObject.cityName);
    expect(lastCustomerAfterEdit.phone, 'Phone of updated customer is incorrect').equal(customerObject.phone);
    expect(lastCustomerAfterEdit.email, 'Email of updated customer is incorrect').equal(customerObject.email);
  });
  it('should not update customer if cancel is clicked', function () {
    const lastCustomerBeforeEdit = customersPage.getCustomer(customersPage.rowNum);
    lastCustomerBeforeEdit.editBtn.waitForVisible(3000);
    lastCustomerBeforeEdit.editBtn.click();
    browser.pause(3000);
    customersModalPage.cancelEditBtn.click();
  });
});
