import {$, ElementFinder} from 'protractor';

export class DeleteModal {
  public okButton: ElementFinder;
  public cancelButton: ElementFinder;

  constructor() {
    this.okButton = $('#deleteOkButton');
    this.cancelButton = $('#deleteCancelButton');
  }
}
