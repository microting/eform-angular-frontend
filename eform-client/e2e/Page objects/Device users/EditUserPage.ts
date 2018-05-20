import {$, ElementFinder} from 'protractor';

export class EditUserPage {
  // elements
  public firstNameInput: ElementFinder;
  public lastNameInput: ElementFinder;
  public saveButton: ElementFinder;

  // actions
  save(): void {
    this.saveButton.click();
  }

  constructor(){
    this.firstNameInput = $('#firstName');
    this.lastNameInput = $('#lastName');
    this.saveButton = $('#saveButton');
  }
}
