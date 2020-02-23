import Page from '../Page';
import customersPage from './Customers.page';

export class CustomersModalPage extends Page {
  constructor() {
    super();
  }

  public get createBtn() {
    return browser.element('#createCustomerBtn');
  }

  public get cancelCreateBtn() {
    return browser.element('#cancelCreateCustomerBtn');
  }

  public get saveEditBtn() {
    return browser.element('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return browser.element('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return browser.element('#customerSaveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return browser.element('#customerDeleteCancelBtn');
  }

  public get createCreatedByInput() {
    return browser.element('#createCreatedBy');
  }

  public get editCreatedByInput() {
    return browser.element('#editCreatedBy');
  }

  public get createCustomerNo() {
    return browser.element('#createCustomerNo');
  }

  public get editCustomerNo() {
    return browser.element('#editCustomerNo');
  }

  public get createContactPerson() {
    return browser.element('#createContactPerson');
  }

  public get editContactPerson() {
    return browser.element('#editContactPerson');
  }

  public get createCompanyName() {
    return browser.element('#createCompanyName');
  }

  public get editCompanyName() {
    return browser.element('#editCompanyName');
  }

  public get createCompanyAddress() {
    return browser.element('#createCompanyAddress');
  }

  public get editCompanyAddress() {
    return browser.element('#editCompanyAddress');
  }

  public get createZipCode() {
    return browser.element('#createZipCode');
  }

  public get editZipCode() {
    return browser.element('#editZipCode');
  }

  public get createCityName() {
    return browser.element('#createCityName');
  }

  public get editCityName() {
    return browser.element('#editCityName');
  }

  public get createPhone() {
    return browser.element('#createPhone');
  }

  public get editPhone() {
    return browser.element('#editPhone');
  }

  public get createEmail() {
    return browser.element('#createEmail');
  }

  public get editEmail() {
    return browser.element('#editEmail');
  }

  public createCustomer(data: any) {
    this.createCreatedByInput.setValue(data.createdBy);
    this.createCustomerNo.setValue(data.customerNo);
    this.createContactPerson.setValue(data.contactPerson);
    this.createCompanyName.setValue(data.companyName);
    this.createCompanyAddress.setValue(data.companyAddress);
    this.createZipCode.setValue(data.zipCode);
    this.createCityName.setValue(data.cityName);
    this.createPhone.setValue(data.phone);
    this.createEmail.setValue(data.email);
    this.createBtn.click();
    browser.pause(16000);
  }

  public updateCustomer(data: any) {
    this.editCreatedByInput.setValue(data.createdBy);
    this.editCustomerNo.setValue(data.customerNo);
    this.editContactPerson.setValue(data.contactPerson);
    this.editCompanyName.setValue(data.companyName);
    this.editCompanyAddress.setValue(data.companyAddress);
    this.editZipCode.setValue(data.zipCode);
    this.editCityName.setValue(data.cityName);
    this.editPhone.setValue(data.phone);
    this.editEmail.setValue(data.email);
    this.saveEditBtn.click();
    browser.pause(16000);
  }

  public createEmptyCustomer() {
    this.createBtn.click();
    browser.pause(16000);
  }

  public deleteCustomer() {
    this.saveDeleteBtn.click();
    browser.pause(16000);
  }

}

const customersModalPage = new CustomersModalPage();
export default customersModalPage;
