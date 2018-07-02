import {$, ElementFinder} from 'protractor';
import data from '../../data';

export class EditUserPage {
  // elements
  public firstNameInput: ElementFinder;
  public lastNameInput: ElementFinder;
  public saveButton: ElementFinder;

  // actions
  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async fillInputs(): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.sendKeys(data.DeviceUsersPage.sampleEditFistName);
    await this.lastNameInput.clear();
    await this.lastNameInput.sendKeys(data.DeviceUsersPage.sampleEditLastName);
  }

  constructor() {
    this.firstNameInput = $('#firstName');
    this.lastNameInput = $('#lastName');
    this.saveButton = $('#saveButton');
  }
}
