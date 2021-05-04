import Page from './Page';

export class TagsModalPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tagRow').length;
  }

  // Create page elements
  public get newTagBtn() {
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    return $('#newTagBtn');
  }

  public get newTagSaveBtn() {
    $('#newTagSaveBtn').waitForDisplayed({ timeout: 20000 });
    return $('#newTagSaveBtn');
  }

  public get newTagSaveCancelBtn() {
    $('#newTagSaveCancelBtn').waitForDisplayed({ timeout: 20000 });
    return $('#newTagSaveCancelBtn');
  }

  public get newTagNameInput() {
    $('#newTagName').waitForDisplayed({ timeout: 20000 });
    return $('#newTagName');
  }

  public get editTagNameInput() {
    $('#tagNameEdit').waitForDisplayed({ timeout: 20000 });
    return $('#tagNameEdit');
  }

  public get tagEditSaveBtn() {
    $('#tagEditSaveBtn').waitForDisplayed({ timeout: 20000 });
    return $('#tagEditSaveBtn');
  }

  public get tagEditSaveCancelBtn() {
    $('#tagEditSaveCancelBtn').waitForDisplayed({ timeout: 20000 });
    return $('#tagEditSaveCancelBtn');
  }

  public get tagDeleteSaveBtn() {
    $('#tagDeleteSaveBtn').waitForDisplayed({ timeout: 20000 });
    return $('#tagDeleteSaveBtn');
  }

  public get tagDeleteSaveCancelBtn() {
    $('#tagDeleteSaveCancelBtn').waitForDisplayed({ timeout: 20000 });
    return $('#tagDeleteSaveCancelBtn');
  }

  public get tagsModalCloseBtn() {
    const ele = $('#tagsModalCloseBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public createTag(tagName: string) {
    this.newTagBtn.click();
    $('#newTagName').waitForDisplayed({ timeout: 90000 });
    this.newTagNameInput.setValue(tagName);
    this.newTagSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
  }

  public cancelCreateTag(tagName: string) {
    this.newTagBtn.click();
    $('#newTagName').waitForDisplayed({ timeout: 90000 });
    this.newTagNameInput.setValue(tagName);
    this.newTagSaveCancelBtn.click();
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
  }

  public editTag(rowNumber: number, name: string) {
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.editTagClick();
    this.editTagNameInput.setValue(name);
    this.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public cancelEditTag(rowNumber: number, name: string) {
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.editTagClick();
    this.editTagNameInput.setValue(name);
    this.tagEditSaveCancelBtn.click();
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
  }

  public deleteTag(rowNumber: number) {
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.deleteTag();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public cancelDeleteTag(rowNumber: number) {
    $('#newTagBtn').waitForDisplayed({ timeout: 20000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.deleteTag();
    this.tagDeleteSaveCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public getTagByName(name: string) {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const tag = new TagRowObject(i);
      if (tag.name === name) {
        return tag;
      }
    }
    return null;
  }

  public closeTagModal() {
    this.tagsModalCloseBtn.click();
  }
}

const tagsModalPage = new TagsModalPage();
export default tagsModalPage;

export class TagRowObject {
  constructor(rowNumber) {
    this.name = $$('#tagName')[rowNumber - 1].getText();
    this.editTagBtn = $$('#editTagBtn')[rowNumber - 1];
    this.deleteTagBtn = $$('#deleteTagBtn')[rowNumber - 1];
  }

  public name;
  public editTagBtn;
  public deleteTagBtn;

  public editTagClick() {
    this.editTagBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public deleteTag() {
    this.deleteTagBtn.click();
    tagsModalPage.tagDeleteSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }
}
