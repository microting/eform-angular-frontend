// noinspection JSIgnoredPromiseFromCall

import { PageWithNavbarPage } from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';
import { FoldersRowObject } from './Folders.page';
import { DeviceUsersRowObject } from './DeviceUsers.page';
import tagsModalPage from './TagsModal.page';

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
    const ele = await $('#idSort');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createdAtSortBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createdAtSort');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async eformNameSortBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#nameEFormSort');
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
    await browser.pause(500);
    const obj = new MyEformsRowObject();
    return await obj.getRow(await this.rowNum());
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
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.newEformBtn()).click();
    await (await this.xmlTextArea()).waitForDisplayed({ timeout: 40000 });
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    await browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    await (await this.xmlTextArea()).addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      await (await this.createEformNewTagInput()).setValue(
        newTagsList.join(',')
      );
      await spinnerAnimation.waitForDisplayed({
        timeout: 50000,
        reverse: true,
      });
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      await spinnerAnimation.waitForDisplayed({
        timeout: 50000,
        reverse: true,
      });
      for (let i = 0; i < tagAddedNum; i++) {
        await (await this.createEformTagSelector()).click();
        const selectedTag = await $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(await selectedTag.getText());
        await selectedTag.waitForDisplayed({ timeout: 40000 });
        await selectedTag.waitForClickable({ timeout: 40000 });
        await selectedTag.click();
        await spinnerAnimation.waitForDisplayed({
          timeout: 50000,
          reverse: true,
        });
        (await $('#createEformBtn')).waitForDisplayed({ timeout: 10000 });
        // browser.pause(5000);
      }
    }
    await (await this.createEformBtn()).click();
    // browser.pause(14000);
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await (await this.newEformBtn()).waitForClickable({ timeout: 40000 });
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
    await $('#spinner-animation').waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
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
  editTagsBtn;
  addPairEformBtn;
  editPairEformBtn;
  editColumnsBtn;
  deleteBtn;
  uploadZipArchiveBtn;
  goVisualEditorBtn;

  async getRow(rowNum: number) {
    const currentPosition = rowNum - 1;
    this.element = (await $$('#mainPageEFormsTableBody tr'))[currentPosition];
    this.id = +(await (await $$('#eform-id-' + (rowNum - 1)))[0].getText());
    try {
      const val = (await $$('#eform-created-at-' + (rowNum - 1)))[0];
      this.createdAt = new Date(await val.getText());
    } catch (e) {}
    try {
      const val = (await $$('#eform-label-' + (rowNum - 1)))[0];
      this.eFormName = await val.getText();
    } catch (e) {}
    const val2 = (await $$(`#mainPageEFormsTableBody tr`))[rowNum - 1];
    this.tags = await val2.$$(`#eform-tag-` + (rowNum - 1));
    // this.pairs = await $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-pair"]`);
    this.editTagsBtn = (await $$('#eform-edit-btn-' + (rowNum - 1)))[0];
    this.editPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr`))[
      rowNum - 1
    ].$('#eform-pairing-btn-' + (rowNum - 1));
    this.addPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr`))[
      rowNum - 1
    ].$('#eform-add-btn-' + (rowNum - 1));
    this.editColumnsBtn = (await $$('#edit-columnts-btn-' + (rowNum - 1)))[0];
    this.deleteBtn = (await $$('#delete-eform-btn-' + (rowNum - 1)))[0];
    this.uploadZipArchiveBtn = (await $$('#upload-zip-btn-' + (rowNum - 1)))[0];
    this.goVisualEditorBtn = await this.element.$(
      `#edit-eform-btn-${currentPosition}`
    );
    return this;
  }

  async deleteEForm() {
    (await this.deleteBtn).scrollIntoView();
    (await this.deleteBtn).click();
    const eFormDeleteDeleteBtn = await $('#eFormDeleteDeleteBtn');
    await eFormDeleteDeleteBtn.waitForDisplayed({ timeout: 40000 });
    await eFormDeleteDeleteBtn.waitForClickable({ timeout: 40000 });
    await eFormDeleteDeleteBtn.click();
    await $('#spinner-animation').waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
    await browser.pause(500);
  }

  async addTag(tag: string) {
    await this.editTagsBtn.waitForClickable({ timeout: 40000 });
    await this.editTagsBtn.click();
    const tagSelector = await $('app-eform-edit-tags-modal #tagSelector input');
    await tagSelector.waitForDisplayed({ timeout: 40000 });
    await tagSelector.setValue(tag);
    const ngDropdownPanel = await $('.ng-option');
    await ngDropdownPanel.waitForClickable({ timeout: 40000 });
    await ngDropdownPanel.click();
    await (await myEformsPage.tagEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
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
    await (await $('#spinner-animation')).waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
  }

  async pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    if (await this.editPairEformBtn.isExisting()) {
      await this.editPairEformBtn.click();
    } else {
      await this.addPairEformBtn.click();
    }
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    await (await myEformsPage.cancelParingBtn()).waitForDisplayed({
      timeout: 40000,
    });
    await browser.pause(500);
    const folders = await $$('tree-node');
    for (let i = 0; i < folders.length; i++) {
      if (
        (await (await folders[i].$('#folderTreeName')).getText()).includes(
          folder.name
        )
      ) {
        await (await folders[i].$('#folderTreeName')).click();
      }
    }
    for (let i = 0; i < users.length; i++) {
      const checkbox = await $(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoView();
      await checkbox.$('..').waitForClickable({ timeout: 40000 });
      await checkbox.$('..').click();
    }
    await (await myEformsPage.saveParingBtn()).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  async unPair(users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    this.editPairEformBtn.click();
    await (await spinnerAnimation).waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
    (await await myEformsPage.cancelParingBtn()).waitForDisplayed({
      timeout: 40000,
    });
    for (let i = 0; i < users.length; i++) {
      const checkbox = await $(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoView();
      await (await checkbox.$('..')).waitForClickable({ timeout: 40000 });
      await (await checkbox.$('..')).click();
    }
    await (await myEformsPage.saveParingBtn()).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  async goToVisualEditor() {
    await this.goVisualEditorBtn.click();
    await (await $('#manageTags')).waitForClickable({ timeout: 40000 });
  }
}
