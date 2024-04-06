import Page from './Page';
import { $ } from '@wdio/globals';

export class TagsModalPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tagName')).length;
  }

  // Create page elements
  public async newTagBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#newTagBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return $('#newTagBtn');
  }

  public async newTagSaveBtn(): Promise<WebdriverIO.Element> {
    await (await $('#newTagSaveBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#newTagSaveBtn');
  }

  public async newTagSaveCancelBtn(): Promise<WebdriverIO.Element> {
    await (await $('#newTagSaveCancelBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#newTagSaveCancelBtn');
  }

  public async newTagNameInput(): Promise<WebdriverIO.Element> {
    await (await $('#newTagName')).waitForDisplayed({ timeout: 40000 });
    return $('#newTagName');
  }

  public async editTagNameInput(): Promise<WebdriverIO.Element> {
    await (await $('#tagNameEdit')).waitForDisplayed({ timeout: 40000 });
    return $('#tagNameEdit');
  }

  public async tagEditSaveBtn(): Promise<WebdriverIO.Element> {
    await (await $('#tagEditSaveBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#tagEditSaveBtn');
  }

  public async tagEditSaveCancelBtn(): Promise<WebdriverIO.Element> {
    await (await $('#tagEditSaveCancelBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#tagEditSaveCancelBtn');
  }

  public async tagDeleteSaveBtn(): Promise<WebdriverIO.Element> {
    await (await $('#tagDeleteSaveBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveBtn');
  }

  public async tagDeleteSaveCancelBtn(): Promise<WebdriverIO.Element> {
    await (await $('#tagDeleteSaveCancelBtn')).waitForDisplayed({ timeout: 40000 });
    return $('#tagDeleteSaveCancelBtn');
  }

  public async tagsModalCloseBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#tagsModalCloseBtn');
    // await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createTag(tagName: string) {
    await (await this.newTagBtn()).click();
    await browser.pause(500);
    await (await $('#newTagName')).waitForDisplayed({ timeout: 90000 });
    await (await this.newTagNameInput()).setValue(tagName);
    await (await this.newTagSaveBtn()).click();
    await browser.pause(500);
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
  }

  public async cancelCreateTag(tagName: string) {
    await (await this.newTagBtn()).click();
    await browser.pause(500);
    await (await $('#newTagName')).waitForDisplayed({ timeout: 90000 });
    await (await this.newTagNameInput()).setValue(tagName);
    await (await this.newTagSaveCancelBtn()).click();
    await browser.pause(500);
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
  }

  public async editTag(rowNumber: number, name: string) {
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await browser.pause(500);
    await (await this.editTagNameInput()).setValue(name);
    await (await this.tagEditSaveBtn()).click();
    await browser.pause(1000);
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
  }

  public async cancelEditTag(rowNumber: number, name: string) {
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await (await this.editTagNameInput()).setValue(name);
    await (await this.tagEditSaveCancelBtn()).click();
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
  }

  public async deleteTag(rowNumber: number) {
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag();
  }

  public async cancelDeleteTag(rowNumber: number) {
    await (await $('#newTagBtn')).waitForDisplayed({ timeout: 40000 });
    const result = new TagRowObject();
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag(true);
    await (await this.tagDeleteSaveCancelBtn()).click();
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
    await (await this.tagsModalCloseBtn()).click();
    await browser.pause(500);
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
  }

  public async deleteTag(clickCancel = false) {
    let closeBtn = await tagsModalPage.tagsModalCloseBtn();
    await (await closeBtn).waitForDisplayed({ timeout: 40000 });
    await this.deleteTagBtn.click();
    if (clickCancel) {
      await (await tagsModalPage.tagDeleteSaveCancelBtn()).click();
    } else {
      await browser.pause(500);
      await (await $('#tagDeleteSaveBtn')).click();
    }
    closeBtn = await tagsModalPage.tagsModalCloseBtn();
    await closeBtn.waitForDisplayed({ timeout: 40000 });
  }
}
