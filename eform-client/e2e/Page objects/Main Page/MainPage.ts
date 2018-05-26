import {$, ElementFinder} from 'protractor';
import {DeleteEformModal} from './delete-eform.modal';
import {EditColumnsModal} from './edit-columns.modal';
import {EditTagModal} from './edit-tag.modal';
import {PairEformModal} from './pair-eform.modal';
import {CreateEformModal} from './create-eform.modal';
import {MainPageRowObject} from './mainPage.row-object';

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
  mainPageRowObject: MainPageRowObject;

  // actions
  createEform() {

  }

  selectTagForFilter(tagName) {

  }

  sortByID() {

  }

  sortByCreatedAt() {

  }

  sortByNameEForm() {

  }

  deleteEform() {

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
