import data from '../../data';
import {$, ElementFinder} from 'protractor';

export class AddNewUserModal {

  // elements
  public firstNameInput: ElementFinder;
  public lastNameInput: ElementFinder;
  public saveButton: ElementFinder;
  public cancelButton: ElementFinder;

  // actions
  async fillFirstNameInput(): Promise<void> {
    await this.firstNameInput.sendKeys(data.DeviceUsersPage.sampleFirstName);

  }

  async fillLastNameInput(): Promise<void>{
    await this.lastNameInput.sendKeys(data.DeviceUsersPage.sampleLastName);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  constructor() {
    this.firstNameInput = $('#firstName');
    this.lastNameInput = $('#lastName');
    this.saveButton = $('#saveButton');
    this.cancelButton = $('#cancelButton');
  }
}
