import loginPage from '../../Page objects/Login.page';
import {generateRandmString} from '../../Helpers/helper-functions';
import customersPage, {CustomersRowObject} from '../../Page objects/Customers/Customers.page';
import customersModalPage from '../../Page objects/Customers/CustomersModal.page';

const expect = require('chai').expect;

describe('Customers plugin page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    customersPage.goToCustomersPage();
  });
  it('should add new customer with all empty fields', function () {
    customersPage.newCustomerBtn.click();
    browser.pause(6000);
    const rowCountBeforeCreation = customersPage.rowNum;
    customersModalPage.createEmptyCustomer();
    const rowCountAfterCreation = customersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new customer').equal(rowCountBeforeCreation + 1);
  });
  it('should add new customer with all fields', function () {
    customersPage.newCustomerBtn.click();
    browser.pause(6000);
    const customerObject = {
      createdBy: 'John Smith',
      customerNo: '1',
      contactPerson: 'Samantha Black',
      companyName: 'BMW',
      companyAddress: 'ABC Street 22',
      zipCode: '021551',
      cityName: 'Odense',
      phone: '123124',
      email: 'user@user.com'
    };
    const rowCountBeforeCreation = customersPage.rowNum;
    customersModalPage.createCustomer(customerObject);
    const rowCountAfterCreation = customersPage.rowNum;
    browser.pause(2000);
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastCustomer: CustomersRowObject = customersPage.getCustomer(customersPage.rowNum);
    expect(lastCustomer.createdBy, 'Created by of created customer is incorrect').equal(customerObject.createdBy);
    expect(lastCustomer.customerNo, 'Customer number of created customer is incorrect').equal(customerObject.customerNo);
    expect(lastCustomer.contactPerson, 'Contact person of created customer is incorrect').equal(customerObject.contactPerson);
    expect(lastCustomer.companyName, 'Company name of created customer is incorrect').equal(customerObject.companyName);
    expect(lastCustomer.companyAddress, 'Company address of created customer is incorrect').equal(customerObject.companyAddress);
    expect(lastCustomer.zipCode, 'Zip code of created customer is incorrect').equal(customerObject.zipCode);
    expect(lastCustomer.cityName, 'City name of created customer is incorrect').equal(customerObject.cityName);
    expect(lastCustomer.phone, 'Phone of created customer is incorrect').equal(customerObject.phone);
    expect(lastCustomer.email, 'Email of created customer is incorrect').equal(customerObject.email);
    browser.pause(6000);
  });
  it('should not add new customer if cancel is clicked', function () {
    customersPage.newCustomerBtn.click();
    browser.pause(6000);
    customersModalPage.cancelCreateBtn.click();
  });
});
