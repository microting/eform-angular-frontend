import {$, ElementFinder} from 'protractor';

export class DeleteModal {
  public okButton: ElementFinder;
  public cancelButton: ElementFinder;

  constructor() {
    this.okButton = $('#deleteModalOkButton');
    this.cancelButton = $('#deleteModalCancelButton');
  }
}
