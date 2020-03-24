import Page from '../Page';
import customersPage from './Customers.page';

export class CustomersModalPage extends Page {
  constructor() {
    super();
  }

  public get createBtn() {
    return $('#createCustomerBtn');
  }

  public get cancelCreateBtn() {
    return $('#cancelCreateCustomerBtn');
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return $('#customerSaveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return $('#customerDeleteCancelBtn');
  }

  public get createCreatedByInput() {
    return $('#createCreatedBy');
  }

  public get editCreatedByInput() {
    return $('#editCreatedBy');
  }

  public get createCustomerNo() {
    return $('#createCustomerNo');
  }

  public get editCustomerNo() {
    return $('#editCustomerNo');
  }

  public get createContactPerson() {
    return $('#createContactPerson');
  }

  public get editContactPerson() {
    return $('#editContactPerson');
  }

  public get createCompanyName() {
    return $('#createCompanyName');
  }

  public get editCompanyName() {
    return $('#editCompanyName');
  }

  public get createCompanyAddress() {
    return $('#createCompanyAddress');
  }

  public get editCompanyAddress() {
    return $('#editCompanyAddress');
  }

  public get createZipCode() {
    return $('#createZipCode');
  }

  public get editZipCode() {
    return $('#editZipCode');
  }

  public get createCityName() {
    return $('#createCityName');
  }

  public get editCityName() {
    return $('#editCityName');
  }

  public get createPhone() {
    return $('#createPhone');
  }

  public get editPhone() {
    return $('#editPhone');
  }

  public get createEmail() {
    return $('#createEmail');
  }

  public get editEmail() {
    return $('#editEmail');
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
