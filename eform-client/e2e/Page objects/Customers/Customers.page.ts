import Page from '../Page';

export class CustomersPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  getCustomer(num): CustomersRowObject {
    return new CustomersRowObject(num);
  }

  public get newCustomerBtn() {
    return browser.element('#newCustomerBtn');
  }

  public get customersSettingsBtn() {
    return browser.element('#firstName');
  }

  public get importCustomersSettingsBtn() {
    return browser.element('#lastName');
  }

  public get saveImportCustomersBtn() {
    return browser.element('#saveCreateBtn');
  }

  public get cancelImportCustomersBtn() {
    return browser.element('#saveCreateBtn');
  }

  public get deleteCustomerBtn() {
    return browser.element('#cancelCreateBtn');
  }

  public get editCustomerBtn() {
    return browser.element('#editCustomerBtn');
  }

  public get customersButton() {
    return browser.element('#customers-pn');
  }

  public goToCustomersPage() {
    this.customersButton.click();
    browser.pause(20000);
  }

  public get saveDeleteBtn() {
    return browser.element('#customerSaveDeleteBtn');
  }
}

const customersPage = new CustomersPage();
export default customersPage;

export class CustomersRowObject {
  constructor(rowNumber) {
    this.createdBy = $$('#CreatedBy')[rowNumber - 1].getText();
    this.customerNo = $$('#CustomerNo')[rowNumber - 1].getText();
    this.contactPerson = $$('#ContactPerson')[rowNumber - 1].getText();
    this.companyName = $$('#CompanyName')[rowNumber - 1].getText();
    this.companyAddress = $$('#CompanyAddress')[rowNumber - 1].getText();
    this.zipCode = $$('#ZipCode')[rowNumber - 1].getText();
    this.cityName = $$('#CityName')[rowNumber - 1].getText();
    this.email = $$('#Email')[rowNumber - 1].getText();
    this.phone = $$('#Phone')[rowNumber - 1].getText();
    this.editBtn = $$('#editCustomerBtn')[rowNumber - 1];
    this.deleteBtn = $$('#deleteCustomerBtn')[rowNumber - 1];
  }

  public id;
  public version;
  public updatedByUserId;
  public createdBy;
  public customerNo;
  public contactPerson;
  public companyName;
  public companyAddress;
  public zipCode;
  public cityName;
  public email;
  public phone;
  public editBtn;
  public deleteBtn;
}
