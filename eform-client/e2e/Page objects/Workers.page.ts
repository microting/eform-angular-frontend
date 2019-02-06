import {PageWithNavbarPage} from './PageWithNavbar.page';

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
  public get workerCreateBtn() {
    return browser.element('#workerCreateBtn');
  }
  public get workerSaveBtn() {
    return browser.element('#workerSaveBtn');
  }
  public createNewWorker(firstName: string, lastName: string) {
    this.workerCreateBtn.click();
    browser.pause(8000);
    this.firstNameBox.addValue(firstName);
    this.lastNameBox.addValue(lastName);
    browser.pause(1000);
    this.workerSaveBtn.click();
    browser.pause(16000);
  }
}

const workers = new Workers();
export default workers;
