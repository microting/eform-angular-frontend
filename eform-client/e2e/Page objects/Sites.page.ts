import {PageWithNavbarPage} from './PageWithNavbar.page';

class SitesPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get editTagsBtn() {
    return $('#newDeviceUserBtn');
  }

  public get newTagInput() {
    const ele = $('#newTag');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public get newTagCreateBtn() {
    const ele = $('#newTagCreateBtn');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public get siteTagSelector() {
    const ele = $('#tagSelector');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public siteTagSearchField() {
    return $(`#tagSelector .ng-input > input`);
  }

  public get updateTagsBtn() {
    const ele = $('#saveTagsBtn');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public get tagRemovalSelector() {
    const ele = $('#tagForRemoval');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public siteTagListOfOptions() {
    return $$(`#tagSelector .ng-option`);
  }

  public get removeTagBtn() {
    const ele = $('#removeTagBtn');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  getFirstRowObject(): SitesRowObject {
    browser.pause(500);
    return new SitesRowObject(1);
  }

  public tagExists(tagName: string) {
    $('#tagSelector').waitForDisplayed({timeout: 20000});
    this.siteTagSelector.click();
    const selectedTag = $('#tagSelector .ng-option');
    selectedTag.getText();
    return selectedTag.getText() === tagName;
  }

  public tagNotSelected(tagName: string) {
    this.siteTagSelector.click();
    const availableTag = $('.ng-option:not(.ng-option-selected)');
    availableTag.getText();
    return availableTag.getText() === tagName;
  }

  public get getFirstAvailableTag() {
    this.siteTagSelector.click();
    return $('.ng-option:not(.ng-option-selected)');
  }

  public createTag(site: SitesRowObject, tagName: string) {
    site.siteTagsEditBtn.click();
    $('#tagSelector').waitForDisplayed({timeout: 20000});
    sitesPage.newTagInput.setValue(tagName);
    sitesPage.newTagCreateBtn.click();
  }

  public createAndAssignTag(tagName: string, sitesRows: number[]) {
    const firstSite = this.getFirstRowObject();
    this.createTag(firstSite, tagName);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.cancelCreateBtn.click();
    for (const siteRow of sitesRows) {
      this.getSite(siteRow).siteTagsEditBtn.click();
      $('#newTag').waitForDisplayed({timeout: 20000});
      this.siteTagSearchField().addValue(tagName);
      const siteTagChoice = this.siteTagListOfOptions()[0];
      siteTagChoice.waitForDisplayed({timeout: 30000});
      siteTagChoice.waitForClickable({timeout: 30000});
      siteTagChoice.click();
      sitesPage.updateTagsBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
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
    browser.pause(500);
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
