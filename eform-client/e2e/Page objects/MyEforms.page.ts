import {PageWithNavbarPage} from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';
import {FoldersRowObject} from './Folders.page';
import {DeviceUsersRowObject} from './DeviceUsers.page';

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newEformBtn() {
    const el = $('#newEFormBtn');
    el.waitForDisplayed({timeout: 20000});
    el.waitForClickable({timeout: 20000});
    return el;
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#eform-id').length;
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
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get createEformNewTagInput() {
    return $('#addTagInput');
  }

  public get xmlTextArea() {
    const ele = $('#eFormXml');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get createEformBtn() {
    const ele = $('#createEformBtn');
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }

  public get cancelCreateEformBtn() {
    return $('#cancelCreateEformBtn');
  }

  get tagEditSaveBtn() {
    const el = $('#tagEditSaveBtn');
    el.waitForClickable({timeout: 30000});
    return el;
  }

  get tagEditSaveCancelBtn() {
    const ele = $('#tagEditSaveCancelBtn');
    ele.waitForClickable({timeout: 20000});
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

  getFirstMyEformsRowObj(): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(1);
  }

  getEformRowObj(num): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(num);
  }

  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
    this.newEformBtn.click();
    $('#eFormXml').waitForDisplayed({timeout: 20000});
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
      spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        // console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
        $('#createEformBtn').waitForDisplayed({timeout: 10000});
        // browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    // browser.pause(14000);
    spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
    $('#delete-eform-btn').waitForDisplayed({timeout: 20000});
    return {added: addedTags, selected: selectedTags};
  }

  createNewTag(nameTag: string) {
    const spinnerAnimation = $('#spinner-animation');
    myEformsPage.getFirstMyEformsRowObj().editTagsBtn.click();
    const newTagInput = $('#newTag');
    newTagInput.waitForDisplayed({timeout: 20000});
    newTagInput.setValue(nameTag);
    newTagInput.$('..').$('button').click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
    this.tagEditSaveBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
  }

  removeTag(nameTag: string) {
    const spinnerAnimation = $('#spinner-animation');
    myEformsPage.getFirstMyEformsRowObj().editTagsBtn.click();
    const removeTagSelect = $('#removeTagSelect');
    removeTagSelect.waitForDisplayed({timeout: 20000});
    removeTagSelect.$('input').setValue(nameTag);
    const ngDropdownPanel = $('.ng-option');
    ngDropdownPanel.waitForClickable({timeout: 20000});
    ngDropdownPanel.click();
    removeTagSelect.$('..').$('button').click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
    this.tagEditSaveCancelBtn.click();
  }

  enterTagFilter(nameTag: string) {
    const spinnerAnimation = $('#spinner-animation');
    this.tagSelector.$('input').setValue(nameTag);
    const option = $('ng-dropdown-panel .ng-option');
    option.waitForClickable({timeout: 10000});
    option.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
  }
}

const myEformsPage = new MyEformsPage();
export default myEformsPage;

class MyEformsRowObject {
  constructor(rowNum) {
    if ($$('#eform-id')[rowNum - 1]) {
      this.id = +$$('#eform-id')[rowNum - 1];
      try {
        this.createdAt = new Date($$('#eform-created-at')[rowNum - 1].getText());
      } catch (e) {
      }
      try {
        this.eFormName = $$('#eform-label')[rowNum - 1].getText();
      } catch (e) {
      }
      this.tags = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$$(`#eform-tag`);
      this.pairs = $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-pair"]`);
      this.editTagsBtn = $$('#eform-edit-btn')[rowNum - 1];
      this.editPairEformBtn = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$('#eform-pairing-btn');
      this.addPairEformBtn = $$(`#mainPageEFormsTableBody tr`)[rowNum - 1].$('#eform-add-btn');
      this.editColumnsBtn = $$('#edit-columnts-btn')[rowNum - 1];
      this.deleteBtn = $$('#delete-eform-btn')[rowNum - 1];
      this.uploadZipArchiveBtn = $$('#upload-zip-btn')[rowNum - 1];
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
    this.deleteBtn.click();
    const eFormDeleteDeleteBtn = $('#eFormDeleteDeleteBtn');
    eFormDeleteDeleteBtn.waitForDisplayed({timeout: 20000});
    eFormDeleteDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000});
  }

  addTag(tag: string) {
    this.editTagsBtn.waitForClickable({timeout: 20000});
    this.editTagsBtn.click();
    const tagSelector = $('app-eform-edit-tags-modal #tagSelector input');
    tagSelector.waitForDisplayed({timeout: 20000});
    tagSelector.setValue(tag);
    const ngDropdownPanel = $('.ng-option');
    ngDropdownPanel.waitForClickable({timeout: 20000});
    ngDropdownPanel.click();
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000});
  }

  deleteTags(tags: string[]) {
    this.editTagsBtn.waitForClickable({timeout: 20000});
    this.editTagsBtn.click();
    $('app-eform-edit-tags-modal #tagSelector').waitForDisplayed({timeout: 20000});
    const tagSelectorValues = $$('app-eform-edit-tags-modal #tagSelector .ng-value');
    for (let i = 0; i < tagSelectorValues.length; i++) {
      const tagName = tagSelectorValues[i].$('span.ng-value-label').getText();
      const deleteTagButton = tagSelectorValues[i].$('span');
      if (tags.includes(tagName)) {
        deleteTagButton.click();
      }
    }
    myEformsPage.tagEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000});
  }

  pair(folder: FoldersRowObject, users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    if (this.editPairEformBtn.isExisting()) {
      this.editPairEformBtn.click();
    } else {
     this.addPairEformBtn.click();
    }
    spinnerAnimation.waitForDisplayed({timeout: 90000});
    myEformsPage.cancelParingBtn.waitForDisplayed({timeout: 20000});
    browser.pause(1000);
    const folders = $$('tree-node');
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].$('#folderTreeName').getText() === folder.name
        && folders[i].$('#folderTreeDescription').getText() === folder.description) {
        folders[i].$('#folderTreeName').click();
      }
    }
    for (let i = 0; i < users.length; i++) {
      const checkbox = $(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.$('..').waitForClickable({timeout: 20000});
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
  }
  unPair (users: DeviceUsersRowObject[]) {
    const spinnerAnimation = $('#spinner-animation');
    this.editPairEformBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 20000});
    myEformsPage.cancelParingBtn.waitForDisplayed({timeout: 20000});
    for (let i = 0; i < users.length; i++) {
      console.log(i);
      const checkbox = $(`#checkbox${users[i].siteId}`);
      checkbox.scrollIntoView();
      checkbox.$('..').waitForClickable({timeout: 20000});
      checkbox.$('..').click();
    }
    myEformsPage.saveParingBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000});
  }
}
