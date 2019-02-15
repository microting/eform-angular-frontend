import Page from '../Page';

export class CustomersImportPage extends Page {
  constructor() {
    super();
  }

  public get saveImportCustomersBtn() {
    return browser.element('#saveCreateBtn');
  }

  public get cancelImportCustomersBtn() {
    return browser.element('#saveCreateBtn');
  }
}

const customersImportPage = new CustomersImportPage();
export default customersImportPage;
