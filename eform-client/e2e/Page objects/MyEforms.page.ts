import {PageWithNavbarPage} from './PageWithNavbar.page';
import XMLForEform from '../Constants/XMLForEform';

class MyEformsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newEformBtn() {
    $('#newEFormBtn').waitForDisplayed({timeout: 20000});
    $('#newEFormBtn').waitForClickable({timeout: 20000});
    return $('#newEFormBtn');
  }

  public getRowNum(): number {
    return 10;
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
    return $('#createEformBtn');
  }

  public get cancelCreateEformBtn() {
    return $('#cancelCreateEformBtn');
  }

  getFirstMyEformsRowObj(): MyEformsRowObject {
    browser.pause(500);
    return new MyEformsRowObject(1);
  }

  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
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
      $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        //console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
        $('#createEformBtn').waitForDisplayed({timeout: 10000});
        // browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    // browser.pause(14000);
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    $('#delete-eform-btn').waitForDisplayed({timeout: 20000});
    return {added: addedTags, selected: selectedTags};
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
      } catch (e) {}
      try {
        this.eFormName = $$('#eform-label')[rowNum - 1].getText();
      } catch (e) {}
      this.tags = $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-tag"]`);
      this.pairs = $$(`//*[@id="mainPageEFormsTableBody"]/tr[${rowNum}]//*[@id="eform-tag"]`);
      this.editTagsBtn = $$('#eform-edit-btn')[rowNum - 1];
      this.pairEformBtn = $$('#eform-pairing-btn')[rowNum - 1];
      this.editColumnsBtn = $$('#edit-columnts-btn')[rowNum - 1];
      this.deleteBtn = $$('#delete-eform-btn')[rowNum - 1];
      this.uploadZipArchiveBtn = $$('#upload-zip-btn')[rowNum - 1];
    }
  }

  id: number;
  createdAt: Date;
  eFormName;
  tags;
  editTagsBtn;
  pairs;
  pairEformBtn;
  editColumnsBtn;
  deleteBtn;
  uploadZipArchiveBtn;
}
