import Page from '../Page';

export class CustomersSettingsPage extends Page {
  constructor() {
    super();
  }

  public get deleteCustomerBtn() {
    return browser.element('#cancelCreateBtn');
  }

  public get saveEditBtn() {
    return browser.element('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return browser.element('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return browser.element('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return browser.element('#cancelDeleteBtn');
  }
  public getCheckboxById(id: string) {
    return browser.element('#checkbox' + id);
  }

  public clickCheckboxById(id: string) {
    const el = browser.element('#mat-checkbox' + id);
    el.click();
    browser.pause(5000);
  }
  public  getSearchField() {
    return browser.element('.ng-input > input');
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
