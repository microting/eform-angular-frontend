import { PageWithNavbarPage } from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';
import { FoldersRowObject } from './Folders.page';
import { DeviceUsersRowObject } from './DeviceUsers.page';
import tagsModalPage from './TagsModal.page';

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newEformBtn() {
    const el = $('#newEFormBtn');
    el.waitForDisplayed({ timeout: 40000 });
    el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    const ele = await $$('.eform-id');
    return ele.length;
  }

  public get idSortBtn() {
    const ele = $('#idSort');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get createdAtSortBtn() {
    const ele = $('#createdAtSort');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get eformNameSortBtn() {
    const ele = $('#nameEFormSort');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get eformFilter() {
    return $('#labelInput');
  }

  // Create eform modal
  public get createEformTagSelector() {
    const ele = $('#createEFormMultiSelector');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get importEformsBtn() {
    const ele = $('#importEformsBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get createEformNewTagInput() {
    return $('#addTagInput');
  }

  public get xmlTextArea() {
    const ele = $('#eFormXml');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get createEformBtn() {
    const ele = $('#createEformBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get cancelCreateEformBtn() {
    return $('#cancelCreateEformBtn');
  }

  get tagEditSaveBtn() {
    const el = $('#tagEditSaveBtn');
    el.waitForClickable({ timeout: 30000 });
    return el;
  }

  get tagEditSaveCancelBtn() {
    const ele = $('#tagEditSaveCancelBtn');
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  get tagSelector() {
    // ele.waitForDisplayed({timeout: 40000});
    return $('#tagSelector');
  }
  get saveParingBtn() {
    return $('#saveParingBtn');
  }

  get cancelParingBtn() {
    return $('#cancelParingBtn');
  }

  get xlsxImportInput() {
    return $('#xlsxImportInput');
  }

  get eformsManageTagsBtn() {
    const ele = $('#eformsManageTagsBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  async getFirstMyEformsRowObj(): Promise<MyEformsRowObject> {
    await browser.pause(500);
    const result = new MyEformsRowObject();
    return await result.GetRow(1);
  }

  async getEformsRowObjByNameEForm(nameEform: string): Promise<MyEformsRowObject> {
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

  async getEformRowObj(num, pause: boolean): Promise<MyEformsRowObject> {
    if (pause) {
      await browser.pause(500);
    }
    const result =  new MyEformsRowObject();
    return await result.GetRow(num);
  }

  async clearEFormTable() {
    const rowNum = await this.rowNum();
    for (let i = rowNum - 1; i > 0; i--) {
      await (await this.getEformRowObj(i, false)).deleteEForm();
    }
  }

  async createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await this.newEformBtn.click();
    (await this.xmlTextArea).waitForDisplayed({ timeout: 40000 });
    // Create replaced xml and insert it in textarea
    const xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    await browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    (await this.xmlTextArea).addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      (await this.createEformNewTagInput).setValue(newTagsList.join(','));
      await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
      for (let i = 0; i < tagAddedNum; i++) {
        (await this.createEformTagSelector).click();
        const selectedTag = await $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(await selectedTag.getText());
        await selectedTag.waitForDisplayed({ timeout: 40000 });
        await selectedTag.waitForClickable({ timeout: 40000 });
        await selectedTag.click();
        await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
        (await $('#createEformBtn')).waitForDisplayed({ timeout: 10000 });
        // browser.pause(5000);
      }
    }
    await this.createEformBtn.click();
    // browser.pause(14000);
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    (await this.newEformBtn).waitForClickable({ timeout: 40000 });
    return { added: addedTags, selected: selectedTags };
  }

  async createNewTag(nameTag: string) {
    await this.createNewTags([nameTag]);
  }

  async createNewTags(nameTags: string[]) {
    await (await this.eformsManageTagsBtn).click();
    await tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      await tagsModalPage.createTag(nameTags[i]);
    }
    await tagsModalPage.closeTagModal();
    await this.newEformBtn.waitForClickable({ timeout: 40000 });
  }

  async removeTag(nameTag: string) {
    await this.removeTags([nameTag]);
  }

  async removeTags(nameTags: string[]) {
    await (await this.eformsManageTagsBtn).click();
    const closeBtn = tagsModalPage.tagsModalCloseBtn;
    await closeBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      const tag = await tagsModalPage.getTagByName(nameTags[i]);
      await tag.deleteTag();
    }
    await tagsModalPage.closeTagModal();
    await this.newEformBtn.waitForClickable({ timeout: 40000 });
  }

  async enterTagFilter(nameTag: string) {
    await this.tagSelector.$('input').setValue(nameTag);
    const option = $('ng-dropdown-panel .ng-option');
    await option.waitForDisplayed({ timeout: 10000 });
    await option.waitForClickable({ timeout: 10000 });
    await option.click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor() {}


  id: number;
  createdAt: Date;
  eFormName: string;
  tags: Array<any>;
  editTagsBtn;
  pairs;
  addPairEformBtn;
  editPairEformBtn;
  editColumnsBtn;
  deleteBtn;
  uploadZipArchiveBtn;

  async GetRow(rowNum: number) {
    // console.log(rowNum);
    // if ((await $$('#eform-id-' + (rowNum - 1)))[0]) {
      this.id = +await (await $$('#eform-id-' + (rowNum - 1)))[0].getText();
      try {
        const val = (await $$('#eform-created-at-' + (rowNum - 1)))[0];
        this.createdAt = new Date(
          await val.getText()
        );
      } catch (e) {}
      try {
        const val = (await $$('#eform-label-' + (rowNum - 1)))[0];
        this.eFormName = await val.getText();
        // console.log(this.eFormName);
      } catch (e) {}
      const val2 = (await $$(`#mainPageEFormsTableBody tr`))[rowNum - 1];
      this.tags = await val2.$$(`#eform-tag-` + (rowNum - 1));
      this.pairs = await $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-pair"]`);
      this.editTagsBtn = (await $$('#eform-edit-btn-' + (rowNum - 1)))[0];
      this.editPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr`)[rowNum - 1]).$('#eform-pairing-btn-' + (rowNum - 1));
      this.addPairEformBtn = await (await $$(`#mainPageEFormsTableBody tr`)[rowNum - 1]).$('#eform-add-btn-' + (rowNum - 1));
      this.editColumnsBtn = (await $$('#edit-columnts-btn-' + (rowNum - 1)))[0];
      this.deleteBtn = (await $$('#delete-eform-btn-' + (rowNum - 1)))[0];
      this.uploadZipArchiveBtn = (await $$('#upload-zip-btn-' + (rowNum - 1)))[0];
    // }
    return this;
  }

  async deleteEForm() {
    (await this.deleteBtn).scrollIntoView();
    (await this.deleteBtn).click();
    const eFormDeleteDeleteBtn = await $('#eFormDeleteDeleteBtn');
    await eFormDeleteDeleteBtn.waitForDisplayed({ timeout: 40000 });
    await eFormDeleteDeleteBtn.waitForClickable({ timeout: 40000 });
    await eFormDeleteDeleteBtn.click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
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
    await (await myEformsPage.tagEditSaveBtn).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }

  async deleteTags(tags: string[]) {
    this.editTagsBtn.waitForClickable({ timeout: 40000 });
    this.editTagsBtn.click();
    $('app-eform-edit-tags-modal #tagSelector').waitForDisplayed({
      timeout: 40000,
    });
    const tagSelectorValues = await $$(
      'app-eform-edit-tags-modal #tagSelector .ng-value'
    );
    for (let i = 0; i < tagSelectorValues.length; i++) {
      const tagName = await tagSelectorValues[i].$('span.ng-value-label').getText();
      const deleteTagButton = tagSelectorValues[i].$('span');
      if (tags.includes(tagName)) {
        deleteTagButton.click();
      }
    }
    await (await myEformsPage.tagEditSaveBtn).click();
    await $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }

  async pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    if (this.editPairEformBtn.isExisting()) {
      this.editPairEformBtn.click();
    } else {
      this.addPairEformBtn.click();
    }
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    await myEformsPage.cancelParingBtn.waitForDisplayed({ timeout: 40000 });
    await browser.pause(500);
    const folders = await $$('tree-node');
    for (let i = 0; i < folders.length; i++) {
      console.log(folders[i].$('#folderTreeName').getText());
      if ((await folders[i].$('#folderTreeName').getText()).includes(folder.name)) {
        folders[i].$('#folderTreeName').click();
      }
    }
    for (let i = 0; i < users.length; i++) {
      const checkbox = $(`#checkbox${users[i].siteId}`);
      await checkbox.scrollIntoView();
      await checkbox.$('..').waitForClickable({ timeout: 40000 });
      await checkbox.$('..').click();
    }
    await myEformsPage.saveParingBtn.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  unPair(users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    this.editPairEformBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    myEformsPage.cancelParingBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < users.length; i++) {
      const checkbox = $(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.$('..').waitForClickable({ timeout: 40000 });
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }
}
