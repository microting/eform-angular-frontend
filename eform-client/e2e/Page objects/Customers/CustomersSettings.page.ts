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
  public  getCheckboxById(id: string) {
    return browser.element('#checkbox' + id);
  }

  public clickOnChecboxById(id: string) {
    const el = browser.element('#mat-checkbox-' + id);
    el.click();
    browser.pause(2000);
  }

  public get cancelDeleteBtn() {
    return browser.element('#cancelDeleteBtn');
  }
}

const customersSettingsPage = new CustomersSettingsPage();
export default customersSettingsPage;
