import {$, ElementFinder} from 'protractor';
import data from '../../data';

export class EditUserPage {
  // elements
  public firstNameInput: ElementFinder;
  public lastNameInput: ElementFinder;
  public saveButton: ElementFinder;

  // actions
  save(): void {
    this.saveButton.click();
  }

  fillInputs() {
    this.firstNameInput.clear();
    this.firstNameInput.sendKeys(data.DeviceUsersPage.sampleEditFistName);
    this.lastNameInput.clear();
    this.lastNameInput.sendKeys(data.DeviceUsersPage.sampleEditLastName);
  }

  constructor() {
    this.firstNameInput = $('#firstName');
    this.lastNameInput = $('#lastName');
    this.saveButton = $('#saveButton');
  }
}
