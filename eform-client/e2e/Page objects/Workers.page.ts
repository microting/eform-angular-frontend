import {PageWithNavbarPage} from './PageWithNavbar.page';
import {DeviceUsersRowObject} from './DeviceUsers.page';

export class Workers extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get firstNameBox() {
    return $('#firstName');
  }
  public get lastNameBox() {
    return $('#lastName');
  }
  public get firstNameEditBox() {
    return $('#firstNameEdit');
  }
  public get lastNameEditBox() {
    return $('#lastNameEdit');
  }
  public get workerCreateBtn() {
    return $('#workerCreateBtn');
  }
  public get workerSaveBtn() {
    return $('#workerSaveBtn');
  }
  public get workerEditBtn() {
    return $('#workerEditBtn');
  }
  public get workerEditSaveBtn() {
    return $('#workerEditSaveBtn');
  }
  public get workerSelect() {
    return $('#workerSelector');
  }
  public get firstElement() {
    return $(`//*[contains(@class, 'custom')]//*[contains(text(), 'Gurkemine Ralphine')]`);
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  getWorker(num): WorkersRowObject {
    return new WorkersRowObject(num);
  }
  public createNewWorker(firstName: string, lastName: string) {
    this.workerCreateBtn.click();
    // browser.pause(8000);
    $('#firstName').waitForDisplayed({timeout: 10000});
    this.workerSelect.click();
    browser.pause(1000);
    this.firstElement.click();
    this.firstNameBox.addValue(firstName);
    this.lastNameBox.addValue(lastName);
    browser.pause(1000);
    this.workerSaveBtn.click();
    // browser.pause(16000);
  }
  public editWorker(worker: WorkersRowObject, firstName: string, lastName: string) {
    worker.editBtn.click();
    // browser.pause(8000);
    $('#firstNameEdit').waitForDisplayed({timeout: 8000});
    this.firstNameEditBox.clearValue();
    this.firstNameEditBox.addValue(firstName);
    browser.pause(2000);
    this.lastNameEditBox.clearValue();
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
