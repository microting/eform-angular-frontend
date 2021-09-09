import Page from './Page';

export class TagsModalPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    return (await $$('#tagRow')).length;
  }

  // Create page elements
  public get newTagBtn() {
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    return $('#newTagBtn');
  }

  public get newTagSaveBtn() {
    $('#newTagSaveBtn').waitForDisplayed({ timeout: 40000 });
    return $('#newTagSaveBtn');
  }

  public get newTagSaveCancelBtn() {
    $('#newTagSaveCancelBtn').waitForDisplayed({ timeout: 40000 });
    return $('#newTagSaveCancelBtn');
  }

  public get newTagNameInput() {
    $('#newTagName').waitForDisplayed({ timeout: 40000 });
    return $('#newTagName');
  }

  public get editTagNameInput() {
    $('#tagNameEdit').waitForDisplayed({ timeout: 40000 });
    return $('#tagNameEdit');
  }

  public get tagEditSaveBtn() {
    $('#tagEditSaveBtn').waitForDisplayed({ timeout: 40000 });
    return $('#tagEditSaveBtn');
  }

  public get tagEditSaveCancelBtn() {
    $('#tagEditSaveCancelBtn').waitForDisplayed({ timeout: 40000 });
    return $('#tagEditSaveCancelBtn');
  }

  public get tagDeleteSaveBtn() {
    $('#tagDeleteSaveBtn').waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveBtn');
  }

  public get tagDeleteSaveCancelBtn() {
    $('#tagDeleteSaveCancelBtn').waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveCancelBtn');
  }

  public get tagsModalCloseBtn() {
    const ele = $('#tagsModalCloseBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public createTag(tagName: string) {
    this.newTagBtn.click();
    $('#newTagName').waitForDisplayed({ timeout: 90000 });
    this.newTagNameInput.setValue(tagName);
    this.newTagSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public cancelCreateTag(tagName: string) {
    this.newTagBtn.click();
    $('#newTagName').waitForDisplayed({ timeout: 90000 });
    this.newTagNameInput.setValue(tagName);
    this.newTagSaveCancelBtn.click();
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public editTag(rowNumber: number, name: string) {
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.editTagClick();
    this.editTagNameInput.setValue(name);
    this.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public cancelEditTag(rowNumber: number, name: string) {
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.editTagClick();
    this.editTagNameInput.setValue(name);
    this.tagEditSaveCancelBtn.click();
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public deleteTag(rowNumber: number) {
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.deleteTag();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public cancelDeleteTag(rowNumber: number) {
    $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const rowObject = new TagRowObject(rowNumber);
    rowObject.deleteTag(true);
    this.tagDeleteSaveCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async getTagByName(name: string) {
    const rowNum = await this.rowNum;
    for (let i = 1; i < 1 + rowNum; i++) {
      const tag = new TagRowObject(i);
      if (tag.name === name) {
        return tag;
      }
    }
    return null;
  }

  public async closeTagModal() {
    (await this.tagsModalCloseBtn).click();
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

  public deleteTag(clickCancel = false) {
    this.deleteTagBtn.click();
    if (clickCancel) {
      tagsModalPage.tagDeleteSaveCancelBtn.click();
    } else {
      tagsModalPage.tagDeleteSaveBtn.click();
    }
    tagsModalPage.tagsModalCloseBtn.waitForClickable({ timeout: 40000 });
  }
}
