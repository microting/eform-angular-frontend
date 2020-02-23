import Page from '../Page';
import {expect} from 'chai';
import {PageWithNavbarPage} from '../PageWithNavbar.page';
import customersModalPage from './CustomersModal.page';
import customersSettingsPage from './CustomerSettings.page';

export class CustomersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public configureSearchableList(listName: string) {
    customersPage.Navbar.advancedDropdown();
    browser.pause(10000);
    customersPage.Navbar.clickonSubMenuItem('Søgbar Lister');
    browser.pause(10000);
    const newSearchListBtn = browser.$('#createEntitySearchBtn');
    const numberOfListsBefore = browser.$$('#tableBody > tr').length;
    newSearchListBtn.click();
    browser.pause(8000);
    const fieldElement = browser.$('#createName');
    fieldElement.addValue(listName);
    const confirmBtn = browser.$('#entitySearchCreateSaveBtn');
    confirmBtn.click();
    browser.pause(8000);
    const numberOfListsAfter = browser.$$('#tableBody > tr').length;
    expect(numberOfListsAfter, 'Number of rows is less than expected').equal(numberOfListsBefore + 1);

    // Configure List
    const nameOfList = 'My testing list';
    customersPage.goToCustomersPage();
    browser.pause(9000);
    customersPage.settingsCustomerBtn.click();
    browser.pause(3000);
    const searchField = customersSettingsPage.getSearchField();
    searchField.addValue(nameOfList);
    const listChoices = customersSettingsPage.getListOfChoices();
    const choice = listChoices[0];
    browser.pause(8000);
    choice.click();
    const fieldToCheck = customersSettingsPage.selectedListField();
    expect(fieldToCheck.getText(), 'Searchable list is not selected').equal('My testing list');
    customersSettingsPage.saveSettings();
  }

  public createCustomer(companyName: string) {
    customersPage.goToCustomersPage();
    customersPage.newCustomerBtn.click();
    browser.pause(6000);
    const customerObject = {
      createdBy: 'John Smith',
      customerNo: '1',
      contactPerson: 'Samantha Black',
      companyName: companyName,
      companyAddress: 'Test',
      zipCode: '021551',
      cityName: 'Odense',
      phone: '123124',
      email: 'user@user.com'
    };
    const rowCountBeforeCreation = customersPage.rowNum();
    browser.pause(2000);
    customersModalPage.createCustomer(customerObject);
    const rowCountAfterCreation = customersPage.rowNum();
    browser.pause(2000);
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastCustomer: CustomersRowObject = customersPage.getCustomer(customersPage.rowNum());
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
  }

  public getListOfChoices() {
    return browser.$$('.ng-option');
  }
  public  selectedListField() {
    return browser.$('.ng-value .ng-value-label');
  }

  public rowNum(): number {
    return browser.$$('#mainTableBody > tr').length;
  }
  public clickIdSort() {
    browser.$('#IdTableHeader').click();
    browser.pause(4000);
  }
  public clickContactSort() {
    browser.$('#ContactPersonTableHeader').click();
    browser.pause(4000);
  }

  public clickCompanySort() {
    browser.$('#CompanyNameTableHeader').click();
    browser.pause(4000);
  }

  public getCustomerValue(selector: any, row: number) {
    if (selector === 'Id') {
      return  parseInt( $('#mainTableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText(), 10);
    } else {
      return $('#mainTableBody').$(`tr:nth-child(${row})`).$('#' + selector).getText();
    }
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

  // same purpose as previous method?
  public  importCustomerBtn() {
    return browser.element('#importCustomer');
  }

  public  goToImportBtn() {
    this.importCustomerBtn().click();
    browser.pause(4000);
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

  public get settingsCustomerBtn() {
    return browser.$('#settingsCustomerBtn');
  }

  public goToCustomerSettings() {
    const elem = browser.$('button .btn .btn-danger');
    elem.click();
    browser.pause(4000);
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
