import {$, $$, by, element, ElementArrayFinder, ElementFinder} from 'protractor';
import {DeleteEformModal} from './delete-eform.modal';
import {EditColumnsModal} from './edit-columns.modal';
import {EditTagModal} from './edit-tag.modal';
import {PairEformModal} from './pair-eform.modal';
import {CreateEformModal} from './create-eform.modal';

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


  // actions
  async getRowNumber() {
    const rowNum = $$('#mainPageEFormsTableBody > tr').count();
    return await rowNum;
  }

  getTagsForFilter(): ElementArrayFinder {
    return element.all(by.xpath('//*[@id="tagSelector"]/div/div/a'));
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
