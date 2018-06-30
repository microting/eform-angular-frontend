import {$, $$, browser, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import {DeleteEformModal} from './delete-eform.modal';
import {EditColumnsModal} from './edit-columns.modal';
import {EditTagModal} from './edit-tag.modal';
import {PairEformModal} from './pair-eform.modal';
import {CreateEformModal} from './create-eform.modal';
import {getMainPageRowObject, MainPageRowObject} from './mainPage.row-object';

export class MainPage {
  // Modals
  deleteEformModal: DeleteEformModal;
  editColumnsModal: EditColumnsModal;
  editTagModal: EditTagModal;
  pairEformModal: PairEformModal;
  createEFormModal: CreateEformModal;

  // Elements
  labelInput: ElementFinder;
  newEformBtn: ElementFinder;
  idSortBtn: ElementFinder;
  createdAtSortBtn: ElementFinder;
  nameEFormSortBtn: ElementFinder;
  tagSelector: ElementFinder;

  static async getAllMainPageRowObjects() {
    const rowObjArr: MainPageRowObject[] = [];
    const rowNum = await $$('#mainPageEFormsTableBody > tr').count(); // dublicate of method below, will be refactored in future
    for (let i = 1; i < rowNum; i++) {
      const obj = await getMainPageRowObject(i);
      rowObjArr.push(obj);
    }
    return rowObjArr;
  }

  // actions
  async getRowNumber() { // this method will be made static in future
    browser.waitForAngular();
    const rowNum = $$('#mainPageEFormsTableBody > tr').count();
    return await rowNum;
  }

  getTagsForFilter(): ElementArrayFinder {
    browser.waitForAngular();
    return element.all(by.xpath('//*[@id="tagSelector"]/div/ul/li/a'));
  }

  constructor() {
    // modals
    this.deleteEformModal = new DeleteEformModal();
    this.editColumnsModal = new EditColumnsModal();
    this.editTagModal = new EditTagModal();
    this.pairEformModal = new PairEformModal();
    this.createEFormModal = new CreateEformModal();
    // elements
    this.labelInput = $('#labelInput');
    this.newEformBtn = $('#newEFormBtn');
    this.idSortBtn = $('#idSort');
    this.createdAtSortBtn = $('#createdAtSort');
    this.nameEFormSortBtn = $('#nameEFormSort');
    this.tagSelector = $('#tagSelector');
  }

}
