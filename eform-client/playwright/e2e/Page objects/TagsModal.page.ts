import { Page, Locator } from '@playwright/test';
import BasePage from './Page';

export class TagsModalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('#tagName').count();
  }

  public newTagBtn(): Locator {
    return this.page.locator('#newTagBtn');
  }

  public newTagSaveBtn(): Locator {
    return this.page.locator('#newTagSaveBtn');
  }

  public newTagSaveCancelBtn(): Locator {
    return this.page.locator('#newTagSaveCancelBtn');
  }

  public newTagNameInput(): Locator {
    return this.page.locator('#newTagName');
  }

  public editTagNameInput(): Locator {
    return this.page.locator('#tagNameEdit');
  }

  public tagEditSaveBtn(): Locator {
    return this.page.locator('#tagEditSaveBtn');
  }

  public tagEditSaveCancelBtn(): Locator {
    return this.page.locator('#tagEditSaveCancelBtn');
  }

  public tagDeleteSaveBtn(): Locator {
    return this.page.locator('#tagDeleteSaveBtn');
  }

  public tagDeleteSaveCancelBtn(): Locator {
    return this.page.locator('#tagDeleteSaveCancelBtn');
  }

  public tagsModalCloseBtn(): Locator {
    return this.page.locator('#tagsModalCloseBtn');
  }

  public async createTag(tagName: string) {
    await this.newTagBtn().click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#newTagName').waitFor({ state: 'visible', timeout: 90000 });
    await this.newTagNameInput().fill(tagName);
    await this.newTagSaveBtn().click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public async cancelCreateTag(tagName: string) {
    await this.newTagBtn().click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#newTagName').waitFor({ state: 'visible', timeout: 90000 });
    await this.newTagNameInput().fill(tagName);
    await this.newTagSaveCancelBtn().click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public async editTag(rowNumber: number, name: string) {
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
    const result = new TagRowObject(this.page, this);
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await this.page.waitForTimeout(500);
    await this.editTagNameInput().fill(name);
    await this.tagEditSaveBtn().click();
    await this.page.waitForTimeout(1000);
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public async cancelEditTag(rowNumber: number, name: string) {
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
    const result = new TagRowObject(this.page, this);
    const rowObject = await result.getRow(rowNumber);
    await rowObject.editTagClick();
    await this.editTagNameInput().fill(name);
    await this.tagEditSaveCancelBtn().click();
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
  }

  public async deleteTag(rowNumber: number) {
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
    const result = new TagRowObject(this.page, this);
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag();
  }

  public async cancelDeleteTag(rowNumber: number) {
    await this.page.locator('#newTagBtn').waitFor({ state: 'visible', timeout: 40000 });
    const result = new TagRowObject(this.page, this);
    const rowObject = await result.getRow(rowNumber);
    await rowObject.deleteTag(true);
    await this.tagDeleteSaveCancelBtn().click();
  }

  public async getTagByName(name: string): Promise<TagRowObject | null> {
    const rowNum = await this.rowNum();
    for (let i = 1; i < 1 + rowNum; i++) {
      const result = new TagRowObject(this.page, this);
      const tag = await result.getRow(i);
      if (tag.name === name) {
        return tag;
      }
    }
    return null;
  }

  public async closeTagModal() {
    await this.tagsModalCloseBtn().click();
    await this.page.waitForTimeout(500);
  }
}

export class TagRowObject {
  constructor(page: Page, tagsModalPage: TagsModalPage) {
    this.page = page;
    this.tagsModalPage = tagsModalPage;
  }

  page: Page;
  tagsModalPage: TagsModalPage;
  public name: string;
  public editTagBtn: Locator;
  public deleteTagBtn: Locator;

  async getRow(rowNum: number): Promise<TagRowObject> {
    this.name = await this.page.locator('#tagName').nth(rowNum - 1).textContent() || '';
    this.editTagBtn = this.page.locator('#editTagBtn').nth(rowNum - 1);
    this.deleteTagBtn = this.page.locator('#deleteTagBtn').nth(rowNum - 1);
    return this;
  }

  public async editTagClick() {
    await this.editTagBtn.click();
  }

  public async deleteTag(clickCancel = false) {
    await this.tagsModalPage.tagsModalCloseBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.deleteTagBtn.click();
    if (clickCancel) {
      await this.tagsModalPage.tagDeleteSaveCancelBtn().click();
    } else {
      await this.page.waitForTimeout(500);
      await this.page.locator('#tagDeleteSaveBtn').click();
    }
    await this.tagsModalPage.tagsModalCloseBtn().waitFor({ state: 'visible', timeout: 40000 });
  }
}
