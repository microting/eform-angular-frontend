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
    el.waitForDisplayed({ timeout: 20000 });
    el.waitForClickable({ timeout: 90000 });
    return el;
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('.eform-id').length;
  }

  public get idSortBtn() {
    return $('#idSort');
  }

  public get createdAtSortBtn() {
    return $('#createdAtSort');
  }

  public get eformNameSortBtn() {
    return $('#nameEFormSort');
  }

  public get eformFilter() {
    return $('#labelInput');
  }

  // Create eform modal
  public get createEformTagSelector() {
    const ele = $('#createEFormMultiSelector');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get importEformsBtn() {
    const ele = $('#importEformsBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createEformNewTagInput() {
    return $('#addTagInput');
  }

  public get xmlTextArea() {
    const ele = $('#eFormXml');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createEformBtn() {
    const ele = $('#createEformBtn');
    ele.waitForDisplayed({ timeout: 20000 });
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
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  get tagSelector() {
    // ele.waitForDisplayed({timeout: 20000});
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
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  getFirstMyEformsRowObj(): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(1);
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
    for (let i = this.rowNum - 1; i > 0; i--) {
      this.getEformRowObj(i).deleteEForm();
    }
  }

  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    this.newEformBtn.click();
    this.xmlTextArea.waitForDisplayed({ timeout: 20000 });
    // Create replaced xml and insert it in textarea
    const xml = XMLForEform.XML.replace('TEST_LABEL', eFormLabel);
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
        selectedTag.waitForDisplayed({ timeout: 20000 });
        selectedTag.waitForClickable({ timeout: 20000 });
        selectedTag.click();
        spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
        $('#createEformBtn').waitForDisplayed({ timeout: 10000 });
        // browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    // browser.pause(14000);
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    $('#delete-eform-btn-0').waitForDisplayed({ timeout: 20000 });
    return { added: addedTags, selected: selectedTags };
  }

  createNewTag(nameTag: string) {
    this.createNewTags([nameTag]);
  }

  createNewTags(nameTags: string[]) {
    this.eformsManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 20000 });
    for (let i = 0; i < nameTags.length; i++) {
      tagsModalPage.createTag(nameTags[i]);
    }
    tagsModalPage.closeTagModal();
    this.newEformBtn.waitForClickable({ timeout: 20000 });
  }

  removeTag(nameTag: string) {
    this.removeTags([nameTag]);
  }

  removeTags(nameTags: string[]) {
    this.eformsManageTagsBtn.click();
    tagsModalPage.tagsModalCloseBtn.waitForDisplayed({ timeout: 20000 });
    for (let i = 0; i < nameTags.length; i++) {
      tagsModalPage.getTagByName(nameTags[i]).deleteTag();
    }
    tagsModalPage.closeTagModal();
    this.newEformBtn.waitForClickable({ timeout: 20000 });
  }

  enterTagFilter(nameTag: string) {
    this.tagSelector.$('input').setValue(nameTag);
    const option = $('ng-dropdown-panel .ng-option');
    option.waitForDisplayed({ timeout: 10000 });
    option.waitForClickable({ timeout: 10000 });
    option.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 20000, reverse: true });
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor(rowNum: number) {
    if ($$('#eform-id-' + (rowNum - 1))[0]) {
      this.id = +$$('#eform-id-' + (rowNum - 1))[0];
      try {
        this.createdAt = new Date(
          $$('#eform-created-at-' + (rowNum - 1))[0].getText()
        );
      } catch (e) {}
      try {
        this.eFormName = $$('#eform-label-' + (rowNum - 1))[0].getText();
      } catch (e) {}
      this.tags = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$$(
        `#eform-tag-` + (rowNum - 1)
      );
      this.pairs = $$(
        `//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-pair"]`
      );
      this.editTagsBtn = $$('#eform-edit-btn-' + (rowNum - 1))[0];
      this.editPairEformBtn = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$(
        '#eform-pairing-btn-' + (rowNum - 1)
      );
      this.addPairEformBtn = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$(
        '#eform-add-btn-' + (rowNum - 1)
      );
      this.editColumnsBtn = $$('#edit-columnts-btn-' + (rowNum - 1))[0];
      this.deleteBtn = $$('#delete-eform-btn-' + (rowNum - 1))[0];
      this.uploadZipArchiveBtn = $$('#upload-zip-btn-' + (rowNum - 1))[0];
    }
  }

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

  deleteEForm() {
    this.deleteBtn.scrollIntoView();
    this.deleteBtn.click();
    const eFormDeleteDeleteBtn = $('#eFormDeleteDeleteBtn');
    eFormDeleteDeleteBtn.waitForDisplayed({ timeout: 20000 });
    eFormDeleteDeleteBtn.waitForClickable({ timeout: 20000 });
    eFormDeleteDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 20000, reverse: true });
    browser.pause(500);
  }

  addTag(tag: string) {
    this.editTagsBtn.waitForClickable({ timeout: 20000 });
    this.editTagsBtn.click();
    const tagSelector = $('app-eform-edit-tags-modal #tagSelector input');
    tagSelector.waitForDisplayed({ timeout: 20000 });
    tagSelector.setValue(tag);
    const ngDropdownPanel = $('.ng-option');
    ngDropdownPanel.waitForClickable({ timeout: 20000 });
    ngDropdownPanel.click();
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 20000, reverse: true });
  }

  deleteTags(tags: string[]) {
    this.editTagsBtn.waitForClickable({ timeout: 20000 });
    this.editTagsBtn.click();
    $('app-eform-edit-tags-modal #tagSelector').waitForDisplayed({
      timeout: 20000,
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
    $('#spinner-animation').waitForDisplayed({ timeout: 20000, reverse: true });
  }

  pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    if (this.editPairEformBtn.isExisting()) {
      this.editPairEformBtn.click();
    } else {
      this.addPairEformBtn.click();
    }
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    myEformsPage.cancelParingBtn.waitForDisplayed({ timeout: 20000 });
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
      checkbox.$('..').waitForClickable({ timeout: 20000 });
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  unPair(users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    this.editPairEformBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 20000, reverse: true });
    myEformsPage.cancelParingBtn.waitForDisplayed({ timeout: 20000 });
    for (let i = 0; i < users.length; i++) {
      const checkbox = $(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.$('..').waitForClickable({ timeout: 20000 });
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }
}
