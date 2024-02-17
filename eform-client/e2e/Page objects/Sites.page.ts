import { PageWithNavbarPage } from './PageWithNavbar.page';
import tagsModalPage from './TagsModal.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    return (await $$('tbody > tr')).length;
  }

  public async siteTagSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#tagSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public siteTagRemovalListOfOptions() {
    return $$(`#tagForRemoval .ng-option`);
  }

  public async updateTagsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveTagsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async tagRemovalSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#tagForRemoval');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async removeTagBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#removeTagBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async sitesManageTagsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#sitesManageTagsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async asyncFirstAvailableTag(): Promise<WebdriverIO.Element> {
    await (await this.siteTagSelector()).click();
    return $('.ng-option:not(.ng-option-selected)');
  }

  public async cancelCreateBtn(): Promise<WebdriverIO.Element> {
    return $('#cancelCreateBtn');
  }

  public async siteEditCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#siteEditCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async siteNameEditInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#siteName');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async tagSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#tagSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async siteEditSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#siteEditSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async siteDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#siteDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async siteDeleteDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#siteDeleteDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async createTag(tagName: string[]) {
    await (await this.sitesManageTagsBtn()).click();
    await browser.pause(500);
    await (await tagsModalPage.tagsModalCloseBtn()).waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < tagName.length; i++) {
      await tagsModalPage.createTag(tagName[i]);
    }
    await tagsModalPage.closeTagModal();
    await (await sitesPage.sitesManageTagsBtn()).waitForClickable({ timeout: 40000 });
  }

  public async removeTags(tagName: string[]) {
    await (await this.sitesManageTagsBtn()).click();
    await browser.pause(500);
    await (await tagsModalPage.tagsModalCloseBtn()).waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < tagName.length; i++) {
      await (await tagsModalPage.getTagByName(tagName[i])).deleteTag();
    }
    await tagsModalPage.closeTagModal();
    await (await sitesPage.sitesManageTagsBtn()).waitForClickable({ timeout: 40000 });
  }

  async getSite(num): Promise<SitesRowObject> {
    await browser.pause(500);
    const obj = new SitesRowObject();
    return await obj.getRow(num);
  }

  async getFirstRowObject(): Promise<SitesRowObject> {
    await browser.pause(500);
    const rowNum = await this.rowNum();
    if (rowNum > 1) {
      return this.getSite(2);
    } else {
      return this.getSite(1);
    }
  }
}

const sitesPage = new SitesPage();
export default sitesPage;

export class SitesRowObject {
  constructor() {}

  element: WebdriverIO.Element;
  siteId: number;
  units: string;
  siteName: string;
  tags: string[];
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  async getRow(rowNum): Promise<SitesRowObject> {
    this.element = (await $$('tbody > tr'))[rowNum - 1];
    if (this.element) {
      this.siteId = +(await this.element.$('#siteUUId')).getText();
      this.units = await (await this.element.$('#units')).getText();
      this.siteName = await (await this.element.$('#siteName')).getText();
      let list = [];
      try {
        list = (await (await this.element.$('#tags')).$$('span'));
      }catch (e) {
      }
      if(list) {
        let tagsTexts = [];
        for (let i = 0; i < list.length; i++) {
          tagsTexts.push(await list[i].getText());
        }
        this.tags = tagsTexts;
        //this.tags = await Promise.all(list.map(element => element.getText()));
      }
      // .map((element) => element.getText());
      this.editBtn = await this.element.$('#editSiteBtn');
      this.deleteBtn = await this.element.$('#deleteSiteBtn');
    }
    return this;
  }

  async openEditModal(site?: { name?: string; tags?: string[] }) {
    this.editBtn.click();
    await browser.pause(500);
    await (await sitesPage.siteEditCancelBtn()).waitForDisplayed({ timeout: 40000 });
    if (site) {
      if (site.name) {
        await (await sitesPage.siteNameEditInput()).clearValue();
        await (await sitesPage.siteNameEditInput()).setValue(site.name);
        await browser.pause(500);
      }
      if (site.tags) {
        for (let i = 0; i < site.tags.length; i++) {
          await (await (await sitesPage.tagSelector()).$('input')).addValue(site.tags[i]);
          await browser.pause(500);
          await browser.keys(['Return']);
        }
      }
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (await sitesPage.siteEditCancelBtn()).click();
    } else {
      await (await sitesPage.siteEditSaveBtn()).click();
    }
    await browser.pause(500);
    await (await sitesPage.sitesManageTagsBtn()).waitForClickable({ timeout: 40000 });
  }

  async edit(site?: { name?: string; tags?: string[] }, clickCancel = false) {
    await this.openEditModal(site);
    await this.closeEditModal(clickCancel);
  }

  async openDeleteModal() {
    await this.deleteBtn.click();
    await browser.pause(500);
    await (await sitesPage.siteDeleteCancelBtn()).waitForClickable({ timeout: 40000 });
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (await sitesPage.siteDeleteCancelBtn()).click();
    } else {
      await (await sitesPage.siteDeleteDeleteBtn()).click();
    }
    await browser.pause(500);
    await (await sitesPage.sitesManageTagsBtn()).waitForClickable({ timeout: 40000 });
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }
}
