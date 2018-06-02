import {$, ElementFinder} from 'protractor';

export class DeleteEformModal {

  deleteEFormOkBtn: ElementFinder;
  deleteEFormCancelBtn: ElementFinder;

  constructor() {
    this.deleteEFormOkBtn = $('#deleteEFormOkBtn');
    this.deleteEFormCancelBtn = $('#deleteEFormCancelBtn');
  }
}
