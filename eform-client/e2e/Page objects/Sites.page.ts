import {PageWithNavbarPage} from './PageWithNavbar.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get editTagsBtn() {
    return $('#newDeviceUserBtn');
  }

  public get newTagInput() {
    return $('#newTag');
  }

  public get newTagCreateBtn() {
    return $('#newTagCreateBtn');
  }

  public get siteTagSelector() {
    return $('#tagSelector');
  }

  public get updateTagsBtn() {
    return $('#saveTagsBtn');
  }

  public get tagRemovalSelector() {
    return $('#tagForRemoval');
  }

  public getTagsListOfChoises() {
    return browser.$$('#tagForRemoval .ng-option');
  }

  public get removeTagBtn() {
    return $('#removeTagBtn');
  }

  getFirstRowObject(): SitesRowObject {
    return new SitesRowObject(1);
  }

  public tagExists(tagName: string) {
    //browser.pause(5000);
    $('#tagSelector').waitForDisplayed(20000);
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
    // browser.pause(8000);
    site.siteTagsEditBtn.click();
    $('#tagSelector').waitForDisplayed(20000);
    // browser.pause(8000);
    sitesPage.newTagInput.setValue(tagName);
    // browser.pause(4000);
    sitesPage.newTagCreateBtn.click();
  }

  public get saveCreateBtn() {
    return $('#saveCreateBtn');
  }

  public get cancelCreateBtn() {
    return $('#cancelCreateBtn');
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return $('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return $('#cancelDeleteBtn');
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
    if ($$('#siteUUId_' + (rowNum - 1))[0]) {
      this.siteId = $$('#siteUUId_' + (rowNum - 1))[0];
      this.units = $$('#units_' + (rowNum - 1))[0];
      this.siteName = $$('#siteName_' + (rowNum - 1))[0];
      this.siteTagsEditBtn = $$('#editSiteTagsBtn_' + (rowNum - 1))[0];
      this.editBtn = $$('#editSiteBtn_' + (rowNum - 1))[0];
      this.assignedTag = $$('#assignedTag_' + (rowNum - 1))[0];
      this.deleteBtn = $$('#deleteSiteBtn_' + (rowNum - 1))[0];
      // this.deleteBtn = $$('#deleteSiteBtn')[rowNum - 1];
    }
  }

  siteId;
  units;
  siteName;
  editBtn;
  siteTagsEditBtn;
  deleteBtn;
  assignedTag;
}
