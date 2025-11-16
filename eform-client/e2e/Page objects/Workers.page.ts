import {PageWithNavbarPage} from './PageWithNavbar.page';
import {DeviceUsersRowObject} from './DeviceUsers.page';
import { $ } from '@wdio/globals';

export class Workers extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public async firstNameBox(): Promise<WebdriverIO.Element> {
    return $('#firstName');
  }
  public async lastNameBox(): Promise<WebdriverIO.Element> {
    return $('#lastName');
  }
  public async firstNameEditBox(): Promise<WebdriverIO.Element> {
    return $('#firstNameEdit');
  }
  public async lastNameEditBox(): Promise<WebdriverIO.Element> {
    return $('#lastNameEdit');
  }
  public async workerCreateBtn(): Promise<WebdriverIO.Element> {
    return $('#workerCreateBtn');
  }
  public async workerSaveBtn(): Promise<WebdriverIO.Element> {
    return $('#workerSaveBtn');
  }
  public async workerEditBtn(): Promise<WebdriverIO.Element> {
    return $('#workerEditBtn');
  }
  public async workerEditSaveBtn(): Promise<WebdriverIO.Element> {
    return $('#workerEditSaveBtn');
  }
  public async workerSelect(): Promise<WebdriverIO.Element> {
    return $('#workerSelector');
  }
  public async firstElement(): Promise<WebdriverIO.Element> {
    return $(`//*[contains(@class, 'custom')]//*[contains(text(), 'Gurkemine Ralphine')]`);
  }
  public async rowNum(): Promise<number> {
    return (await $$('#tableBody > tr')).length;
  }
  getWorker(num): WorkersRowObject {
    return new WorkersRowObject(num);
  }
  public async createNewWorker(firstName: string, lastName: string) {
    await (await this.workerCreateBtn()).click();
    // browser.pause(8000);
    await (await $('#firstName')).waitForDisplayed({timeout: 10000});
    await (await this.workerSelect()).click();
    await browser.pause(1000);
    await (await this.firstElement()).click();
    await (await this.firstNameBox()).addValue(firstName);
    await (await this.lastNameBox()).addValue(lastName);
    await browser.pause(1000);
    await (await this.workerSaveBtn()).click();
    // browser.pause(16000);
  }
  public async editWorker(worker: WorkersRowObject, firstName: string, lastName: string) {
    await worker.openRowMenu();
    const index = worker.index - 1;
    const editBtn = await $(`#workerEditBtn${index}`);
    await editBtn.waitForDisplayed({ timeout: 5000 });
    await editBtn.waitForClickable({ timeout: 5000 });
    await editBtn.click();
    // browser.pause(8000);
    await (await $('#firstNameEdit')).waitForDisplayed({timeout: 8000});
    await (await this.firstNameEditBox()).clearValue();
    await (await this.firstNameEditBox()).addValue(firstName);
    await browser.pause(2000);
    await (await this.lastNameEditBox()).clearValue();
    await (await this.lastNameEditBox()).addValue(lastName);
    await browser.pause(2000);
    await (await this.workerEditSaveBtn()).click();
  }
}

const workers = new Workers();
export default workers;

export class WorkersRowObject {
  constructor(rowNumber) {
    this.index = rowNumber + 1;
    this.siteId = +$$('#workerUID')[rowNumber + 1].getText();
    this.firstName = $$('#workerFirstName')[rowNumber + 1].getText();
    this.lastName = $$('#workerLastName')[rowNumber + 1].getText();
    this.editBtn = $$('#workerEditBtn')[rowNumber + 1];
    this.deleteBtn = $$('#workerDeleteBtn')[rowNumber + 1];
  }

  index: number;
  siteId: number;
  firstName;
  lastName;
  editBtn;
  deleteBtn;

  async openRowMenu() {
    const index = this.index - 1;
    const menuBtn = await $(`#action-items-${index} #actionMenu`);
    await menuBtn.waitForDisplayed({ timeout: 5000 });
    await menuBtn.waitForClickable({ timeout: 5000 });
    await menuBtn.scrollIntoView();
    await menuBtn.click();
    await browser.pause(200);
  }
}
