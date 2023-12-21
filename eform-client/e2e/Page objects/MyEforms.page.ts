// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';
import { FoldersRowObject } from './Folders.page';
import { DeviceUsersRowObject } from './DeviceUsers.page';
import tagsModalPage from './TagsModal.page';
//import path from 'path';
const path = require('path');

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public async newEformBtn(): Promise<WebdriverIO.Element> {
    const el = await $('#newEFormBtn');
    await el.waitForDisplayed({ timeout: 40000 });
    await el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    const ele = await $$('.eform-id');
    return ele.length;
  }

  public async idSortBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('.eform-id-header .mat-header-cell-inner .mat-sort-header');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createdAtSortBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('.eform-created-at-header .mat-header-cell-inner .mat-sort-header');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async eformNameSortBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('.eform-name-header .mat-header-cell-inner .mat-sort-header');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async eformFilter(): Promise<WebdriverIO.Element> {
    return $('#labelInput');
  }

  // Create eform modal
  public async createEformTagSelector(): Promise<WebdriverIO.Element> {
    const ele = await $('#createEFormMultiSelector');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async importEformsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#importEformsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createEformNewTagInput(): Promise<WebdriverIO.Element> {
    return $('#addTagInput');
  }

  public async xmlTextArea(): Promise<WebdriverIO.Element> {
    const ele = await $('#eFormXml');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createEformBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createEformBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async cancelCreateEformBtn(): Promise<WebdriverIO.Element> {
    return $('#cancelCreateEformBtn');
  }

  async tagEditSaveBtn(): Promise<WebdriverIO.Element> {
    const el = await $('#tagEditSaveBtn');
    await el.waitForClickable({ timeout: 30000 });
    return el;
  }

  async tagEditSaveCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#tagEditSaveCancelBtn');
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async tagSelector(): Promise<WebdriverIO.Element> {
    // ele.waitForDisplayed({timeout: 40000});
    return $('#tagSelector');
  }
  async saveParingBtn(): Promise<WebdriverIO.Element> {
    return $('#saveParingBtn');
  }

  async cancelParingBtn(): Promise<WebdriverIO.Element> {
    return $('#cancelParingBtn');
  }

  async xlsxImportInput(): Promise<WebdriverIO.Element> {
    return $('#xlsxImportInput');
  }

  async eformsManageTagsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#eformsManageTagsBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async getFirstMyEformsRowObj(): Promise<MyEformsRowObject> {
    await browser.pause(500);
    const result = new MyEformsRowObject();
    return await result.getRow(1);
  }

  async getEformsRowObjByNameEForm(
    nameEform: string
  ): Promise<MyEformsRowObject> {
    await browser.pause(500);
    const rowNum = await this.rowNum();
    for (let i = 1; i < rowNum + 1; i++) {
      const form = await this.getEformRowObj(i, false);
      if (form.eFormName === nameEform) {
        return form;
      }
    }
    return null;
  }

  async getLastMyEformsRowObj(): Promise<MyEformsRowObject> {
    await browser.pause(1500);
    const obj = new MyEformsRowObject();
    const rowNum = await this.rowNum();
    return await obj.getRow(rowNum);
  }

  async getEformRowObj(
    num,
    pause: boolean = false
  ): Promise<MyEformsRowObject> {
    if (pause) {
      await browser.pause(500);
    }
    const result = new MyEformsRowObject();
    return await result.getRow(num);
  }

  public async clearEFormTable() {
    await browser.pause(500);
    const rowCount = await this.rowNum();
    let indexForDelete = 1;
    for (let i = 1; i <= rowCount; i++) {
      const eformsRowObject = await this.getEformRowObj(i, false);
      if (
        eformsRowObject &&
        eformsRowObject.deleteBtn &&
        (await eformsRowObject.deleteBtn.isDisplayed())
      ) {
        await eformsRowObject.deleteEForm();
      } else {
        indexForDelete += 1;
      }
    }
  }

  async createNewEform(
    eFormLabel,
    newTagsList = [],
    tagAddedNum = 0,
    xml = ''
  ) {
    await (await this.newEformBtn()).click();
    await browser.pause(500);
    await (await this.xmlTextArea()).waitForDisplayed({ timeout: 40000 });
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    await browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    await browser.pause(200);
    await (await this.xmlTextArea()).addValue(' ');
    await browser.pause(500);
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      await (await this.createEformNewTagInput()).setValue(
        newTagsList.join(',')
      );
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      for (let i = 0; i < tagAddedNum; i++) {
        await (await this.createEformTagSelector()).click();
        await browser.pause(500);
        const selectedTag = await $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(await selectedTag.getText());
        await selectedTag.waitForDisplayed({ timeout: 40000 });
        await selectedTag.waitForClickable({ timeout: 40000 });
        await selectedTag.click();
        await browser.pause(500);
        (await $('#createEformBtn')).waitForDisplayed({ timeout: 10000 });
        // browser.pause(5000);
      }
    }
    await (await this.createEformBtn()).click();
    // browser.pause(14000);
    await (await this.newEformBtn()).waitForClickable({ timeout: 40000 });
    await browser.pause(500);
    return { added: addedTags, selected: selectedTags };
  }

  async createNewTag(nameTag: string) {
    await this.createNewTags([nameTag]);
  }

  async createNewTags(nameTags: string[]) {
    await (await this.eformsManageTagsBtn()).click();
    await (await tagsModalPage.tagsModalCloseBtn()).waitForDisplayed({
      timeout: 40000,
    });
    for (let i = 0; i < nameTags.length; i++) {
      await tagsModalPage.createTag(nameTags[i]);
    }
    await tagsModalPage.closeTagModal();
    await (await this.newEformBtn()).waitForClickable({ timeout: 40000 });
  }

  async removeTag(nameTag: string) {
    await this.removeTags([nameTag]);
  }

  async removeTags(nameTags: string[]) {
    await (await this.eformsManageTagsBtn()).click();
    const closeBtn = await tagsModalPage.tagsModalCloseBtn();
    await closeBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      const tag = await tagsModalPage.getTagByName(nameTags[i]);
      await tag.deleteTag();
    }
    await tagsModalPage.closeTagModal();
    await (await this.newEformBtn()).waitForClickable({ timeout: 40000 });
  }

  async enterTagFilter(nameTag: string) {
    await (await (await this.tagSelector()).$('input')).setValue(nameTag);
    const option = await $('ng-dropdown-panel .ng-option');
    await option.waitForDisplayed({ timeout: 10000 });
    await option.waitForClickable({ timeout: 10000 });
    await option.click();
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor() {}

  element: WebdriverIO.Element;
  id: number;
  createdAt: Date;
  eFormName: string;
  tags: Array<any>;
  editTagsBtn: WebdriverIO.Element;
  addPairEformBtn: WebdriverIO.Element;
  editPairEformBtn: WebdriverIO.Element;
  editColumnsBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;
  uploadZipArchiveBtn: WebdriverIO.Element;
  goVisualEditorBtn: WebdriverIO.Element;

  async getRow(rowNum: number) {
    const currentPosition = rowNum - 1;
    this.element = (await $$('#mainPageEFormsTableBody tr.mat-mdc-row'))[currentPosition];
    this.id = +(await (await $$('#eform-id-' + (currentPosition)))[0].getText());
    try {
      const val = (await $$('#eform-created-at-' + (currentPosition)))[0];
      this.createdAt = new Date(await val.getText());
    } catch (e) {}
    try {
      const val = (await $$('#eform-label-' + (currentPosition)))[0];
      this.eFormName = await val.getText();
    } catch (e) {}
    const val2 = (await $$(`#mainPageEFormsTableBody tr.mat-mdc-row`))[currentPosition];
    this.tags = await $$(`#eform-tag-` + (currentPosition) + ` span`);
    // this.pairs = await $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-pair"]`);
    this.editTagsBtn = (await $$('#eform-edit-btn-' + (currentPosition)))[0];
    this.editPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr.mat-mdc-row`))[
      currentPosition
    ].$('#eform-pairing-btn-' + (currentPosition));
    this.addPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr.mat-mdc-row`))[
      currentPosition
    ].$('#eform-add-btn-' + (currentPosition));
    this.editColumnsBtn = (await $$('#edit-columnts-btn-' + (currentPosition)))[0];
    this.deleteBtn = (await $$('#delete-eform-btn-' + (currentPosition)))[0];
    this.uploadZipArchiveBtn = (await $$('#upload-zip-btn-' + (currentPosition)))[0];
    this.goVisualEditorBtn = await $(`#edit-eform-btn-${currentPosition}`);
    return this;
  }

  async deleteEForm() {
    if(await this.deleteBtn) {
      await (await this.deleteBtn).scrollIntoView();
      await (await this.deleteBtn).click();
      await browser.pause(500);
      const eFormDeleteDeleteBtn = await $('#eFormDeleteDeleteBtn');
      await eFormDeleteDeleteBtn.waitForDisplayed({timeout: 40000});
      await eFormDeleteDeleteBtn.waitForClickable({timeout: 40000});
      await eFormDeleteDeleteBtn.click();
      await browser.pause(500);
    }
  }

  async addTag(tag: string) {
    await this.editTagsBtn.waitForClickable({ timeout: 40000 });
    await this.editTagsBtn.click();
    await browser.pause(500);
    const tagSelector = await $('app-eform-edit-tags-modal #tagSelector input');
    await tagSelector.waitForDisplayed({ timeout: 40000 });
    await tagSelector.setValue(tag);
    const ngDropdownPanel = await $('.ng-option');
    await ngDropdownPanel.waitForClickable({ timeout: 40000 });
    await ngDropdownPanel.click();
    await (await myEformsPage.tagEditSaveBtn()).click();
    await browser.pause(500);
  }

  async deleteTags(tags: string[]) {
    this.editTagsBtn.waitForClickable({ timeout: 40000 });
    this.editTagsBtn.click();
    await (await $('app-eform-edit-tags-modal #tagSelector')).waitForDisplayed({
      timeout: 40000,
    });
    const tagSelectorValues = await $$(
      'app-eform-edit-tags-modal #tagSelector .ng-value'
    );
    for (let i = 0; i < tagSelectorValues.length; i++) {
      const tagName = await (
        await tagSelectorValues[i].$('span.ng-value-label')
      ).getText();
      const deleteTagButton = tagSelectorValues[i].$('span');
      if (tags.includes(tagName)) {
        deleteTagButton.click();
      }
    }
    await (await myEformsPage.tagEditSaveBtn()).click();
    await browser.pause(500);
  }

  async pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    if (await this.editPairEformBtn.isExisting()) {
      await this.editPairEformBtn.click();
    } else {
      await this.addPairEformBtn.click();
    }
    await browser.pause(500);
    await (await myEformsPage.cancelParingBtn()).waitForDisplayed({
      timeout: 40000,
    });
    await browser.pause(500);
    const folders = await $$('app-eform-tree-view-picker > mat-tree > mat-tree-node');
    //browser.pause(10000);
    for (let i = 0; i < folders.length; i++) {
      if (
        (await (await folders[i].$('div > div')).getText()).includes(
          folder.name
        )
      ) {
        await (await folders[i].$('div')).click();
        await browser.pause(1000);
      }
    }
    for (let i = 0; i < users.length; i++) {
      //const name = `#mat-checkbox-${i+2} > label > div.mat-checkbox-inner-container`;
      const checkbox = await $(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoView();
      //await checkbox.waitForClickable({ timeout: 40000 });
      await checkbox.click();
      await browser.pause(500);
    }
    await (await myEformsPage.saveParingBtn()).click();
    await browser.pause(1000);
  }

  async unPair(users: DeviceUsersRowObject[]) {
    this.editPairEformBtn.click();
    await browser.pause(1000);
    await (await myEformsPage.cancelParingBtn()).waitForDisplayed({
      timeout: 40000,
    });
    for (let i = 0; i < users.length; i++) {
      const checkbox = await $(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoView();
      await (await checkbox.$('..')).waitForClickable({ timeout: 40000 });
      await (await checkbox.$('..')).click();
      await browser.pause(1000);
    }
    await (await myEformsPage.saveParingBtn()).click();
    await browser.pause(1000);
  }

  async goToVisualEditor() {
    await this.goVisualEditorBtn.click();
    await browser.pause(500);
    await (await $('#manageTags')).waitForClickable({ timeout: 40000 });
    await browser.pause(500);
  }
}
