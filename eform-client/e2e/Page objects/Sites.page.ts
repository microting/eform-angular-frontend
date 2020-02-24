import {PageWithNavbarPage} from './PageWithNavbar.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get editTagsBtn() {
    return browser.element('#newDeviceUserBtn');
  }

  public get newTagInput() {
    return browser.element('#newTag');
  }

  public get newTagCreateBtn() {
    return browser.element('#newTagCreateBtn');
  }

  public get siteTagSelector() {
    return browser.element('#tagSelector');
  }

  public get updateTagsBtn() {
    return browser.element('#saveTagsBtn');
  }

  public get tagRemovalSelector() {
    return browser.element('#tagForRemoval');
  }

  public getTagsListOfChoises() {
    return browser.$$('#tagForRemoval .ng-option');
  }

  public get removeTagBtn() {
    return browser.element('#removeTagBtn');
  }

  getFirstRowObject(): SitesRowObject {
    return new SitesRowObject(1);
  }

  public tagExists(tagName: string) {
    browser.pause(5000);
      this.siteTagSelector.click();
      const selectedTag = $('#tagSelector .ng-option');
      selectedTag.getText();
      return selectedTag.getText() === tagName;
  }

  public tagNotSelected(tagName: string) {
    browser.pause(5000);
    this.siteTagSelector.click();
    const availableTag = $('.ng-option:not(.ng-option-selected)');
    availableTag.getText();
    return availableTag.getText() === tagName;
  }

  public get getFirstAvailableTag() {
    browser.pause(5000);
    this.siteTagSelector.click();
    return $('.ng-option:not(.ng-option-selected)');
  }

  public createTag(site: SitesRowObject, tagName: string) {
    browser.pause(8000);
    site.siteTagsEditBtn.click();
    browser.pause(8000);
    sitesPage.newTagInput.setValue(tagName);
    browser.pause(4000);
    sitesPage.newTagCreateBtn.click();
  }

  public get saveCreateBtn() {
    return browser.element('#saveCreateBtn');
  }

  public get cancelCreateBtn() {
    return browser.element('#cancelCreateBtn');
  }

  public get saveEditBtn() {
    return browser.element('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return browser.element('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return browser.element('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return browser.element('#cancelDeleteBtn');
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  getSite(num): SitesRowObject {
    return new SitesRowObject(num);
  }

  getSitesList(maxNum): SitesRowObject[] {
    const users: SitesRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      users[i - 1] = new SitesRowObject(i);
    }
    return users;
  }
}

const sitesPage = new SitesPage();
export default sitesPage;

export class SitesRowObject {
  constructor(rowNum) {
    if ($$('#siteId')[rowNum - 1]) {
      this.siteId = $$('#siteUUId')[rowNum - 1];
      this.siteName = $$('#siteName')[rowNum - 1];
      this.siteTagsEditBtn = $$('#editSiteTagsBtn')[rowNum - 1];
      this.editBtn = $$('#editSiteBtn')[rowNum - 1];
      this.assignedTag = $$('#assignedTag')[rowNum - 1];
      this.deleteBtn = $$('#deleteSiteBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteSiteBtn')[rowNum - 1];
    }
  }

  siteId;
  siteName;
  editBtn;
  siteTagsEditBtn;
  deleteBtn;
  assignedTag;
}
