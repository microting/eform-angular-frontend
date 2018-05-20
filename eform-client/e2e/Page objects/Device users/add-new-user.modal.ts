import data from '../../data';
import {$, ElementFinder} from 'protractor';

export class AddNewUserModal {

  // elements
  public firstNameInput: ElementFinder;
  public lastNameInput: ElementFinder;
  public saveButton: ElementFinder;
  public cancelButton: ElementFinder;

  // actions
  fillFirstNameInput(): void {
    this.firstNameInput.sendKeys(data.DeviceUsersPage.sampleFirstName);

  }

  fillLastNameInput(): void {
    this.lastNameInput.sendKeys(data.DeviceUsersPage.sampleLastName);
  }

  save(): void {
    this.saveButton.click();
  }

  cancel(): void {
    this.cancelButton.click();
  }

  constructor() {
    this.firstNameInput = $('#firstName');
    this.lastNameInput = $('#lastName');
    this.saveButton = $('#saveButton');
    this.cancelButton = $('#cancelButton');
  }
}
