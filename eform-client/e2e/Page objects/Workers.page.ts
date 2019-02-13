import {PageWithNavbarPage} from './PageWithNavbar.page';
import {DeviceUsersRowObject} from './DeviceUsers.page';

export class Workers extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get firstNameBox() {
    return browser.element('#firstName');
  }
  public get lastNameBox() {
    return browser.element('#lastName');
  }
  public get firstNameEditBox() {
    return browser.element('#firstNameEdit');
  }
  public get lastNameEditBox() {
    return browser.element('#lastNameEdit');
  }
  public get workerCreateBtn() {
    return browser.element('#workerCreateBtn');
  }
  public get workerSaveBtn() {
    return browser.element('#workerSaveBtn');
  }
  public get workerEditBtn() {
    return browser.element('#workerEditBtn');
  }
  public get workerEditSaveBtn() {
    return browser.element('#workerEditSaveBtn');
  }
  public get workerSelect() {
    return browser.element('#workerSelector');
  }
  public get firstElement() {
    return browser.element(`//*[contains(@class, 'custom')]//*[contains(text(), 'Gurkemine Ralphine')]`);
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  getWorker(num): WorkersRowObject {
    return new WorkersRowObject(num);
  }
  public createNewWorker(firstName: string, lastName: string) {
    this.workerCreateBtn.click();
    browser.pause(8000);
    this.workerSelect.click();
    browser.pause(1000);
    this.firstElement.click();
    this.firstNameBox.addValue(firstName);
    this.lastNameBox.addValue(lastName);
    browser.pause(1000);
    this.workerSaveBtn.click();
    browser.pause(16000);
  }
  public editWorker(worker: WorkersRowObject, firstName: string, lastName: string) {
    worker.editBtn.click();
    browser.pause(8000);
    this.firstNameEditBox.clearElement();
    this.firstNameEditBox.addValue(firstName);
    browser.pause(2000);
    this.lastNameEditBox.clearElement();
    this.lastNameEditBox.addValue(lastName);
    browser.pause(2000);
    this.workerEditSaveBtn.click();
  }
}

const workers = new Workers();
export default workers;

export class WorkersRowObject {
  constructor(rowNumber) {
    this.siteId = +$$('#workerUID')[rowNumber + 1].getText();
    this.firstName = $$('#workerFirstName')[rowNumber + 1].getText();
    this.lastName = $$('#workerLastName')[rowNumber + 1].getText();
    this.editBtn = $$('#workerEditBtn')[rowNumber + 1];
    this.deleteBtn = $$('#workerDeleteBtn')[rowNumber + 1];
  }

  siteId: number;
  firstName;
  lastName;
  editBtn;
  deleteBtn;
}
