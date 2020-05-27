import Page from '../Page';

export class CustomersImportPage extends Page {
  constructor() {
    super();
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

  public continueImport() {
    $('#continueImportBtn').click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public cancelImport() {
    $('#cancelImportBtn').click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public get numberOfCustomers(): number {
    browser.pause(500);
    return $$('#customersToImport > tr').length;
  }

  public chooseFileBtn() {
    $('#files').waitForDisplayed({timeout: 20000});
    $('#files').waitForClickable({timeout: 20000});
    return $('#files');
  }
  public getField(index: number) {
    const fieldsList = $$('thead > tr > th');
    return fieldsList[index];
  }

  public chooseFromDropdown(fieldName: string, fieldNumber: number) {
    const field = this.getField(fieldNumber);
    field.click();
    // ng-dropdown-panel
    // const choicesList = browser.$$('.ng-dropdown-panel-items');
    $('span=' + fieldName).click();
    // browser.pause(4000);
  }
}

const customersImportPage = new CustomersImportPage();
export default customersImportPage;
