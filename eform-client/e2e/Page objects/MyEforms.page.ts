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

  public get newEformBtn() {
    const el = $('#newEFormBtn');
    el.waitForDisplayed({ timeout: 40000 });
    el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('.eform-id').length;
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

  getFirstMyEformsRowObj(): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(1);
  }

  getLastMyEformsRowObj(): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(this.rowNum);
  }

  getEformsRowObjByNameEForm(nameEform: string): MyEformsRowObject {
    browser.pause(500);
    for (let i = 1; i < this.rowNum + 1; i++) {
      const eform = this.getEformRowObj(i);
      if (eform.eFormName === nameEform) {
        return eform;
      }
    }
    return null;
  }

  getEformRowObj(num): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(num);
  }

  clearEFormTable() {
    while (this.rowNum !== 0) {
      this.getLastMyEformsRowObj().deleteEForm();
    }
  }

  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0, xml = '') {
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    this.newEformBtn.click();
    this.xmlTextArea.waitForDisplayed({ timeout: 40000 });
    // Create replaced xml and insert it in textarea
    if (!xml) {
      xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
    }
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput.setValue(newTagsList.join(','));
      spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        // console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.waitForDisplayed({ timeout: 40000 });
        selectedTag.waitForClickable({ timeout: 40000 });
        selectedTag.click();
        spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
        $('#createEformBtn').waitForDisplayed({ timeout: 10000 });
        // browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    // browser.pause(14000);
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    this.newEformBtn.waitForClickable({ timeout: 40000 });
    return { added: addedTags, selected: selectedTags };
  }

  createNewTag(nameTag: string) {
    this.createNewTags([nameTag]);
  }

  createNewTags(nameTags: string[]) {
    this.eformsManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      tagsModalPage.createTag(nameTags[i]);
    }
    tagsModalPage.closeTagModal();
    this.newEformBtn.waitForClickable({ timeout: 40000 });
  }

  removeTag(nameTag: string) {
    this.removeTags([nameTag]);
  }

  removeTags(nameTags: string[]) {
    this.eformsManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 40000 });
    for (let i = 0; i < nameTags.length; i++) {
      tagsModalPage.getTagByName(nameTags[i]).deleteTag();
    }
    tagsModalPage.closeTagModal();
    this.newEformBtn.waitForClickable({ timeout: 40000 });
  }

  enterTagFilter(nameTag: string) {
    this.tagSelector.$('input').setValue(nameTag);
    const option = $('ng-dropdown-panel .ng-option');
    option.waitForDisplayed({ timeout: 10000 });
    option.waitForClickable({ timeout: 10000 });
    option.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor(rowNum: number) {
    const currentPosition = rowNum - 1;
    this.element = $$('#mainPageEFormsTableBody tr')[currentPosition];
    if (this.element) {
      this.id = +this.element.$(`#eform-id-${currentPosition}`);
      try {
        this.createdAt = new Date(
          this.element.$(`#eform-created-at-${currentPosition}`).getText()
        );
      } catch (e) {}
      try {
        this.eFormName = this.element
          .$(`#eform-label-${currentPosition}`)
          .getText();
      } catch (e) {}
      this.tags = this.element.$$(`#eform-tag-${currentPosition}`);
      this.editTagsBtn = this.element.$(`#eform-edit-btn-${currentPosition}`);
      this.editPairEformBtn = this.element.$(
        `#eform-pairing-btn-${currentPosition}`
      );
      this.addPairEformBtn = this.element.$(
        `#eform-add-btn-${currentPosition}`
      );
      this.editColumnsBtn = this.element.$(
        `#edit-columnts-btn-${currentPosition}`
      );
      this.deleteBtn = this.element.$(`#delete-eform-btn-${currentPosition}`);
      this.uploadZipArchiveBtn = this.element.$(
        `#upload-zip-btn-${currentPosition}`
      );
      this.goVisualEditorBtn = this.element.$(
        `#edit-eform-btn-${currentPosition}`
      );
    }
  }

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

  deleteEForm() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    const eFormDeleteDeleteBtn = $('#eFormDeleteDeleteBtn');
    eFormDeleteDeleteBtn.waitForDisplayed({ timeout: 40000 });
    eFormDeleteDeleteBtn.waitForClickable({ timeout: 40000 });
    eFormDeleteDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
    browser.pause(500);
  }

  addTag(tag: string) {
    this.editTagsBtn.waitForClickable({ timeout: 40000 });
    this.editTagsBtn.click();
    const tagSelector = $('app-eform-edit-tags-modal #tagSelector input');
    tagSelector.waitForDisplayed({ timeout: 40000 });
    tagSelector.setValue(tag);
    const ngDropdownPanel = $('.ng-option');
    ngDropdownPanel.waitForClickable({ timeout: 40000 });
    ngDropdownPanel.click();
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }

  deleteTags(tags: string[]) {
    this.editTagsBtn.waitForClickable({ timeout: 40000 });
    this.editTagsBtn.click();
    $('app-eform-edit-tags-modal #tagSelector').waitForDisplayed({
      timeout: 40000,
    });
    const tagSelectorValues = $$(
      'app-eform-edit-tags-modal #tagSelector .ng-value'
    );
    for (let i = 0; i < tagSelectorValues.length; i++) {
      const tagName = tagSelectorValues[i].$('span.ng-value-label').getText();
      const deleteTagButton = tagSelectorValues[i].$('span');
      if (tags.includes(tagName)) {
        deleteTagButton.click();
      }
    }
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 40000, reverse: true });
  }

  pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    if (this.editPairEformBtn.isExisting()) {
      this.editPairEformBtn.click();
    } else {
      this.addPairEformBtn.click();
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    myEformsPage.cancelParingBtn.waitForDisplayed({ timeout: 40000 });
    browser.pause(500);
    const folders = $$('tree-node');
    for (let i = 0; i < folders.length; i++) {
      console.log(folders[i].$('#folderTreeName').getText());
      if (folders[i].$('#folderTreeName').getText().includes(folder.name)) {
        folders[i].$('#folderTreeName').click();
      }
    }
    for (let i = 0; i < users.length; i++) {
      const checkbox = $(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.$('..').waitForClickable({ timeout: 40000 });
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
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

  goToVisualEditor() {
    this.goVisualEditorBtn.click();
    $('#manageTags').waitForClickable({ timeout: 40000 });
  }
}
