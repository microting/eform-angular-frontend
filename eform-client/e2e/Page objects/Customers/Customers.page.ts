import Page from '../Page';
import {PageWithNavbarPage} from '../PageWithNavbar.page';

export class CustomersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public rowNum(): number {
    return browser.$$('#mainTableBody > tr').length;
  }
  public clickIdSort() {
    browser.$('#IdTableHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }
  public clickContactSort() {
    browser.$('#ContactPersonTableHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }

  public clickCompanySort() {
    browser.$('#CompanyNameTableHeader').click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }

  public getCustomerValue(selector: any, row: number) {
    if (selector.includes('Id')) {
      return  parseInt( $('#mainTableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText(), 10);
    } else {
      return $('#mainTableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText();
    }
  }

  getCustomer(num): CustomersRowObject {
    return new CustomersRowObject(num);
  }

  public get newCustomerBtn() {
    $('#newCustomerBtn').waitForDisplayed({timeout: 20000});
    $('#newCustomerBtn').waitForClickable({timeout: 20000});
    return $('#newCustomerBtn');
  }

  public get customersSettingsBtn() {
    $('#firstName').waitForDisplayed({timeout: 20000});
    $('#firstName').waitForClickable({timeout: 20000});
    return $('#firstName');
  }

  public get importCustomersSettingsBtn() {
    $('#lastName').waitForDisplayed({timeout: 20000});
    $('#lastName').waitForClickable({timeout: 20000});
    return $('#lastName');
  }

  // same purpose as previous method?
  public  importCustomerBtn() {
    $('#importCustomer').waitForDisplayed({timeout: 20000});
    $('#importCustomer').waitForClickable({timeout: 20000});
    return $('#importCustomer');
  }

  public  goToImportBtn() {
    this.importCustomerBtn().click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }

  public get saveImportCustomersBtn() {
    $('#saveCreateBtn').waitForDisplayed({timeout: 20000});
    $('#saveCreateBtn').waitForClickable({timeout: 20000});
    return $('#saveCreateBtn');
  }

  public get cancelImportCustomersBtn() {
    $('#saveCreateBtn').waitForDisplayed({timeout: 20000});
    $('#saveCreateBtn').waitForClickable({timeout: 20000});
    return $('#saveCreateBtn');
  }

  public get deleteCustomerBtn() {
    $('#cancelCreateBtn').waitForDisplayed({timeout: 20000});
    $('#cancelCreateBtn').waitForClickable({timeout: 20000});
    return $('#cancelCreateBtn');
  }

  public get editCustomerBtn() {
    $('#editCustomerBtn').waitForDisplayed({timeout: 20000});
    $('#editCustomerBtn').waitForClickable({timeout: 20000});
    return $('#editCustomerBtn');
  }

  public get customersButton() {
    $('#customers-pn').waitForDisplayed({timeout: 20000});
    $('#customers-pn').waitForClickable({timeout: 20000});
    return $('#customers-pn');
  }

  public get settingsCustomerBtn() {
    return browser.$('#settingsCustomerBtn');
  }

  public goToCustomerSettings() {
    const elem = browser.$('button .btn .btn-danger');
    elem.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }

  public goToCustomersPage() {
    this.customersButton.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
  }

  public get saveDeleteBtn() {
    $('#customerSaveDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#customerSaveDeleteBtn').waitForClickable({timeout: 20000});
    return $('#customerSaveDeleteBtn');
  }
}

const customersPage = new CustomersPage();
export default customersPage;

export class CustomersRowObject {
  constructor(rowNumber) {
    this.createdBy = $$('#CreatedBy_' + (rowNumber - 1))[0].getText();
    this.customerNo = $$('#CustomerNo_' + (rowNumber - 1))[0].getText();
    this.contactPerson = $$('#ContactPerson_' + (rowNumber - 1))[0].getText();
    this.companyName = $$('#CompanyName_' + (rowNumber - 1))[0].getText();
    this.companyAddress = $$('#CompanyAddress_' + (rowNumber - 1))[0].getText();
    this.zipCode = $$('#ZipCode_' + (rowNumber - 1))[0].getText();
    this.cityName = $$('#CityName_' + (rowNumber - 1))[0].getText();
    this.email = $$('#Email_' + (rowNumber - 1))[0].getText();
    this.phone = $$('#Phone_' + (rowNumber - 1))[0].getText();
    this.editBtn = $$('#editCustomerBtn_' + (rowNumber - 1))[0];
    this.copyBtn = $$('#copyCustomerBtn_' + (rowNumber - 1))[0];
    this.deleteBtn = $$('#deleteCustomerBtn_' + (rowNumber - 1))[0];
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
  public copyBtn;
  public deleteBtn;
}
