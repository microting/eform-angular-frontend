import Page from '../Page';

export class CustomersSettingsPage extends Page {
  constructor() {
    super();
  }

  public get deleteCustomerBtn() {
    return $('#cancelCreateBtn');
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return $('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return $('#cancelDeleteBtn');
  }
  public getCheckboxById(id: string) {
    return $('#checkbox' + id);
  }

  public clickCheckboxById(id: string) {
    const el = $('#mat-checkbox' + id);
    el.click();
    browser.pause(5000);
  }
  public  getSearchField() {
    return $('.ng-input > input');
  }
  public getListOfChoices() {
    return browser.$$('.ng-option');
  }
  public  selectedListField() {
    return browser.$('.ng-value .ng-value-label');
  }

  public saveSettings() {
    const saveSettingsBtn = browser.$('#saveSettingsBtn');
    saveSettingsBtn.click();
    browser.pause(6000);
  }
}

const customersSettingsPage = new CustomersSettingsPage();
export default customersSettingsPage;
