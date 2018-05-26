import {$, ElementFinder} from 'protractor';

export class CreateEformModal {

  // Elements
  tagSelector: ElementFinder;
  addTagBtn: ElementFinder;
  addTagInput: ElementFinder;
  xmlTextArea: ElementFinder;
  cancelBtn: ElementFinder;
  saveEFormBtn: ElementFinder;

  // actions
  selectTag() {

  }

  pasteXML() {

  }

  addTag(tagName) {

  }

  constructor() {
    this.addTagBtn = $('#addTagBtn');
    this.xmlTextArea = $('#xmlTextArea');
    this.addTagInput = $('#addTagInput');
    this.tagSelector = $('#createEFormMultiSelector');
    this.cancelBtn = $('#createEFormCancelBtn');
    this.saveEFormBtn = $('#createEFormSaveEFormBtn');
  }

}
