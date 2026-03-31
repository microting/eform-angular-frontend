import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';
import { TagsModalPage } from './TagsModal.page';

export class SitesPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public async rowNum(): Promise<number> {
    return await this.page.locator('tbody > tr').count();
  }

  public siteTagSelector(): Locator {
    return this.page.locator('#tagSelector');
  }

  public siteTagRemovalListOfOptions(): Locator {
    return this.page.locator(`#tagForRemoval .ng-option`);
  }

  public updateTagsBtn(): Locator {
    return this.page.locator('#saveTagsBtn');
  }

  public tagRemovalSelector(): Locator {
    return this.page.locator('#tagForRemoval');
  }

  public removeTagBtn(): Locator {
    return this.page.locator('#removeTagBtn');
  }

  public sitesManageTagsBtn(): Locator {
    return this.page.locator('#sitesManageTagsBtn');
  }

  public async asyncFirstAvailableTag(): Promise<Locator> {
    await this.siteTagSelector().click();
    return this.page.locator('.ng-option:not(.ng-option-selected)');
  }

  public cancelCreateBtn(): Locator {
    return this.page.locator('#cancelCreateBtn');
  }

  public siteEditCancelBtn(): Locator {
    return this.page.locator('#siteEditCancelBtn');
  }

  public siteNameEditInput(): Locator {
    return this.page.locator('#siteName');
  }

  public tagSelector(): Locator {
    return this.page.locator('#tagSelector');
  }

  public siteEditSaveBtn(): Locator {
    return this.page.locator('#siteEditSaveBtn');
  }

  public siteDeleteCancelBtn(): Locator {
    return this.page.locator('#siteDeleteCancelBtn');
  }

  public siteDeleteDeleteBtn(): Locator {
    return this.page.locator('#siteDeleteDeleteBtn');
  }

  public async createTag(tagName: string[]) {
    await this.sitesManageTagsBtn().click();
    await this.page.waitForTimeout(500);
    const tagsModalPage = new TagsModalPage(this.page);
    await tagsModalPage.tagsModalCloseBtn().waitFor({ state: 'visible', timeout: 40000 });
    for (let i = 0; i < tagName.length; i++) {
      await tagsModalPage.createTag(tagName[i]);
    }
    await tagsModalPage.closeTagModal();
    await this.sitesManageTagsBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  public async removeTags(tagName: string[]) {
    await this.sitesManageTagsBtn().click();
    await this.page.waitForTimeout(500);
    const tagsModalPage = new TagsModalPage(this.page);
    await tagsModalPage.tagsModalCloseBtn().waitFor({ state: 'visible', timeout: 40000 });
    for (let i = 0; i < tagName.length; i++) {
      const tag = await tagsModalPage.getTagByName(tagName[i]);
      if (tag) {
        await tag.deleteTag();
      }
    }
    await tagsModalPage.closeTagModal();
    await this.sitesManageTagsBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async getSite(num: number): Promise<SitesRowObject> {
    await this.page.waitForTimeout(500);
    const obj = new SitesRowObject(this.page, this);
    return await obj.getRow(num);
  }

  async getFirstRowObject(): Promise<SitesRowObject> {
    await this.page.waitForTimeout(1500);
    const rowNum = await this.rowNum();
    if (rowNum > 1) {
      return this.getSite(2);
    } else {
      return this.getSite(1);
    }
  }
}

export class SitesRowObject {
  constructor(page: Page, sitesPage: SitesPage) {
    this.page = page;
    this.sitesPage = sitesPage;
  }

  page: Page;
  sitesPage: SitesPage;
  index: number;
  element: Locator;
  siteId: number;
  units: string;
  siteName: string;
  tags: string[];
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number): Promise<SitesRowObject> {
    this.index = rowNum;
    this.element = this.page.locator('tbody > tr').nth(rowNum - 1);
    if ((await this.page.locator('tbody > tr').count()) >= rowNum) {
      this.siteId = +(await this.page.locator(`#siteUUId-${rowNum - 1}`).textContent() || '0');
      this.units = await this.page.locator(`[id^="units-${rowNum - 1}-"]`).first().textContent() || '';
      this.siteName = await this.page.locator(`#siteName-${rowNum - 1}`).textContent() || '';
      let list: Locator | null = null;
      try {
        list = this.page.locator(`#tags-${rowNum - 1}`).locator('span');
      } catch (e) {
      }
      if (list) {
        const tagsTexts: string[] = [];
        const count = await list.count();
        for (let i = 0; i < count; i++) {
          tagsTexts.push((await list.nth(i).textContent() || '').trim());
        }
        this.tags = tagsTexts;
      }
      this.editBtn = this.element.locator('#editSiteBtn');
      this.deleteBtn = this.element.locator('#deleteSiteBtn');
    }
    return this;
  }

  async openRowMenu() {
    const index = this.index - 1;
    const menuBtn = this.page.locator(`#actionMenu${index}`);
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }

  async openEditModal(site?: { name?: string; tags?: string[] }) {
    await this.openRowMenu();
    const index = this.index - 1;
    const editBtn = this.page.locator(`#editSiteBtn${index}`);
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();
    await this.page.waitForTimeout(500);
    await this.sitesPage.siteEditCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
    if (site) {
      if (site.name) {
        await this.sitesPage.siteNameEditInput().clear();
        await this.sitesPage.siteNameEditInput().fill(site.name);
        await this.page.waitForTimeout(500);
      }
      if (site.tags) {
        for (let i = 0; i < site.tags.length; i++) {
          await this.sitesPage.tagSelector().locator('input').pressSequentially(site.tags[i]);
          await this.page.waitForTimeout(1000);
          await this.page.keyboard.press('Enter');
        }
      }
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await this.sitesPage.siteEditCancelBtn().click();
    } else {
      await this.sitesPage.siteEditSaveBtn().click();
    }
    await this.page.waitForTimeout(500);
    await this.sitesPage.sitesManageTagsBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async edit(site?: { name?: string; tags?: string[] }, clickCancel = false) {
    await this.openEditModal(site);
    await this.closeEditModal(clickCancel);
  }

  async openDeleteModal() {
    await this.openRowMenu();
    const index = this.index - 1;
    const deleteBtn = this.page.locator(`#deleteSiteBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    await this.page.waitForTimeout(500);
    await this.sitesPage.siteDeleteCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await this.sitesPage.siteDeleteCancelBtn().click();
    } else {
      await this.sitesPage.siteDeleteDeleteBtn().click();
    }
    await this.page.waitForTimeout(500);
    await this.sitesPage.sitesManageTagsBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }
}
