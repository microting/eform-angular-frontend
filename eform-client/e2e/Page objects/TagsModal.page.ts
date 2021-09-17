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

  public async tagDeleteSaveBtn() {
    await (await $('#tagDeleteSaveBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveBtn');
  }

  public get tagDeleteSaveCancelBtn() {
    // $('#tagDeleteSaveCancelBtn').waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveCancelBtn');
  }

  public get tagsModalCloseBtn() {
    const ele = $('#tagsModalCloseBtn');
    // ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createTag(tagName: string) {
    await this.newTagBtn.click();
    await $('#newTagName').waitForDisplayed({ timeout: 90000 });
    await this.newTagNameInput.setValue(tagName);
    await this.newTagSaveBtn.click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public async cancelCreateTag(tagName: string) {
    await this.newTagBtn.click();
    await $('#newTagName').waitForDisplayed({ timeout: 90000 });
    await this.newTagNameInput.setValue(tagName);
    await this.newTagSaveCancelBtn.click();
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public async editTag(rowNumber: number, name: string) {
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await this.editTagNameInput.setValue(name);
    await this.tagEditSaveBtn.click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async cancelEditTag(rowNumber: number, name: string) {
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await this.editTagNameInput.setValue(name);
    await this.tagEditSaveCancelBtn.click();
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
  }

  public async deleteTag(rowNumber: number) {
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async cancelDeleteTag(rowNumber: number) {
    await $('#newTagBtn').waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag(true);
    await this.tagDeleteSaveCancelBtn.click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async getTagByName(name: string) {
    const rowNum = await this.rowNum();
    for (let i = 1; i < 1 + rowNum; i++) {
      const result = new TagRowObject();
      const tag = await result.getRow(i);
      if (tag.name === name) {
        return tag;
      }
    }
    return null;
  }

  public async closeTagModal() {
    await (await this.tagsModalCloseBtn).click();
  }
}

const tagsModalPage = new TagsModalPage();
export default tagsModalPage;

export class TagRowObject {
  constructor() {  }

  public name;
  public editTagBtn;
  public deleteTagBtn;

  async getRow(rowNum: number): Promise<TagRowObject> {
    this.name = await (await $$('#tagName'))[rowNum - 1].getText();
    this.editTagBtn = (await $$('#editTagBtn'))[rowNum - 1];
    this.deleteTagBtn = (await $$('#deleteTagBtn'))[rowNum - 1];
    return this;
  }

  public async editTagClick() {
    const editBtn = await this.editTagBtn;
    await editBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async deleteTag(clickCancel = false) {
    let closeBtn = tagsModalPage.tagsModalCloseBtn;
    await closeBtn.waitForDisplayed({ timeout: 40000 });
    const deleteBtn = await this.deleteTagBtn;
    await deleteBtn.click();
    if (clickCancel) {
      const cancelBtn = await tagsModalPage.tagDeleteSaveCancelBtn;
      await cancelBtn.click();
    } else {
      await browser.pause(500);
      const saveBtn = await $('#tagDeleteSaveBtn');
      await saveBtn.click();
    }
    closeBtn = tagsModalPage.tagsModalCloseBtn;
    await closeBtn.waitForDisplayed({ timeout: 40000 });
  }
}
