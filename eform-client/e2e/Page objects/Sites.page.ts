import { PageWithNavbarPage } from './PageWithNavbar.page';
import tagsModalPage from './TagsModal.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#sitesTableBody > tr').length;
  }

  public get siteTagSelector() {
    const ele = $('#tagSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public siteTagRemovalListOfOptions() {
    return $$(`#tagForRemoval .ng-option`);
  }

  public get updateTagsBtn() {
    const ele = $('#saveTagsBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get tagRemovalSelector() {
    const ele = $('#tagForRemoval');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get removeTagBtn() {
    const ele = $('#removeTagBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get sitesManageTagsBtn() {
    const ele = $('#sitesManageTagsBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get getFirstAvailableTag() {
    this.siteTagSelector.click();
    return $('.ng-option:not(.ng-option-selected)');
  }

  public get cancelCreateBtn() {
    return $('#cancelCreateBtn');
  }

  public get siteEditCancelBtn() {
    const ele = $('#siteEditCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get siteNameEditInput() {
    const ele = $('#siteName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get tagSelector() {
    const ele = $('#tagSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get siteEditSaveBtn() {
    const ele = $('#siteEditSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get siteDeleteCancelBtn() {
    const ele = $('#siteDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get siteDeleteDeleteBtn() {
    const ele = $('#siteDeleteDeleteBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public createTag(tagName: string[]) {
    this.sitesManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 20000 });
    for (let i = 0; i < tagName.length; i++) {
      tagsModalPage.createTag(tagName[i]);
    }
    tagsModalPage.closeTagModal();
    sitesPage.sitesManageTagsBtn.waitForClickable({ timeout: 20000 });
  }

  public removeTags(tagName: string[]) {
    this.sitesManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 20000 });
    for (let i = 0; i < tagName.length; i++) {
      tagsModalPage.getTagByName(tagName[i]).deleteTag();
    }
    tagsModalPage.closeTagModal();
    sitesPage.sitesManageTagsBtn.waitForClickable({ timeout: 20000 });
  }

  getSite(num): SitesRowObject {
    browser.pause(500);
    return new SitesRowObject(num);
  }

  getFirstRowObject(): SitesRowObject {
    browser.pause(500);
    return this.getSite(1);
  }
}

const sitesPage = new SitesPage();
export default sitesPage;

export class SitesRowObject {
  constructor(rowNum) {
    this.element = $$('#sitesTableBody > tr')[rowNum - 1];
    if (this.element) {
      this.siteId = +this.element.$('#siteUUId').getText();
      this.units = this.element.$('#units').getText();
      this.siteName = this.element.$('#siteName').getText();
      this.tags = this.element
        .$('#tags')
        .$$('#assignedTag')
        .map((element) => element.getText());
      this.editBtn = this.element.$('#editSiteBtn');
      this.deleteBtn = this.element.$('#deleteSiteBtn');
    }
  }

  element: WebdriverIO.Element;
  siteId: number;
  units: string;
  siteName: string;
  tags: string[];
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  openEditModal(site?: { name?: string; tags?: string[] }) {
    this.editBtn.click();
    sitesPage.siteEditCancelBtn.waitForDisplayed({ timeout: 20000 });
    if (site) {
      if (site.name) {
        sitesPage.siteNameEditInput.setValue(site.name);
      }
      if (site.tags) {
        for (let i = 0; i < site.tags.length; i++) {
          sitesPage.tagSelector.$('input').addValue(site.tags[i]);
          browser.keys(['Return']);
        }
      }
    }
  }

  closeEditModal(clickCancel = false) {
    if (clickCancel) {
      sitesPage.siteEditCancelBtn.click();
    } else {
      sitesPage.siteEditSaveBtn.click();
    }
    sitesPage.sitesManageTagsBtn.waitForClickable({ timeout: 20000 });
  }

  edit(site?: { name?: string; tags?: string[] }, clickCancel = false) {
    this.openEditModal(site);
    this.closeEditModal(clickCancel);
  }

  openDeleteModal() {
    this.deleteBtn.click();
    sitesPage.siteDeleteCancelBtn.waitForClickable({ timeout: 20000 });
  }

  closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      sitesPage.siteDeleteCancelBtn.click();
    } else {
      sitesPage.siteDeleteDeleteBtn.click();
    }
    sitesPage.sitesManageTagsBtn.waitForClickable({ timeout: 20000 });
  }

  delete(clickCancel = false) {
    this.openDeleteModal();
    this.closeDeleteModal(clickCancel);
  }
}
