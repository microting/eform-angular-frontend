import {$, $$, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import data from '../../data';

export class EditTagModal {
  // elements
  saveBtn: ElementFinder;
  saveNewTagBtn: ElementFinder;
  deleteTagBtn: ElementFinder;
  templateTagsSelector: ElementFinder;
  newTagInput: ElementFinder;
  cancelBtn: ElementFinder;
  tagListSelectorForDelete: ElementFinder;

  // actions
  async getTemplateTags() {
    const elementFinderArray = element.all(by.xpath(data.MainPage.xpathForTagsInTagSelectorInEditTagModal));
    const elementFinderArrayLength = await elementFinderArray.count();
    let tagArr: ElementFinder[];
    const elementPromiseArr = [];
    for (let i = 0; i < elementFinderArrayLength; i++) {
      elementPromiseArr.push(elementFinderArray.get(i));
    }
    tagArr = await Promise.all(elementPromiseArr);
    return tagArr;
  }

  getTagsInTagList() {
    return element.all(by.xpath(`${data.MainPage.xpathForTagsInTagListForDeletion}`));
  }

  constructor() {
    this.saveBtn = $('#saveTemplateTagBtn');
    this.newTagInput = $('#newTagInput');
    this.cancelBtn = $('#cancelCreationOfTemplateTagBtn');
    this.saveNewTagBtn = $('#saveNewTagBtn');
    this.deleteTagBtn = $('#deleteTagBtn');
    this.templateTagsSelector = $('#templateTagsSelector');
    this.tagListSelectorForDelete = $('#tagListSelectorForDelete');
  }
}
