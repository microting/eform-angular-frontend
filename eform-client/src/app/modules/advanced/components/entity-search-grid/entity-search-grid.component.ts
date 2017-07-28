import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AdvEntityGroupListModel, AdvEntityGroupListRequestModel, AdvEntityGroupModel} from 'app/models/advanced';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EntitySearchService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'eform-entity-search-grid',
  templateUrl: './entity-search-grid.component.html'
})
export class EntitySearchGridComponent {
  @Input() advEntityGroupListModel: AdvEntityGroupListModel;
  @Input() advEntityGroupListRequestModel: AdvEntityGroupListRequestModel;
  @Output() onEntityGroupListRequestChanged = new EventEmitter<AdvEntityGroupListRequestModel>();
  @Output() onEntityGroupChanged = new EventEmitter<void>();
  @Output() onEntityGroupSelectedForEdit = new EventEmitter<string>();
  @ViewChild('deleteAdvEntityGroupModal') deleteAdvEntityGroupModal: ModalComponent;
  selectedAdvEntityGroupId: string;
  selectedAdvEntityGroupModel: AdvEntityGroupModel = new AdvEntityGroupModel;
  isSortedByUidAsc = false;
  isSortedByUidDsc = false;
  isSortedByNameAsc = false;
  isSortedByNameDsc = false;

  constructor(private entitySearchService: EntitySearchService, private notifyService: NotifyService) {
  }

  sortByUid() {
    this.isSortedByNameAsc = false;
    this.isSortedByNameDsc = false;
    this.advEntityGroupListRequestModel.sort = 'id';
    if (this.isSortedByUidDsc) {
      this.isSortedByUidAsc = true;
      this.isSortedByUidDsc = false;
      this.advEntityGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByUidAsc) {
      this.isSortedByUidAsc = false;
      this.isSortedByUidDsc = true;
      this.advEntityGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByUidDsc = true;
      this.advEntityGroupListRequestModel.isSortDsc = true;
    }
    this.onEntityGroupListRequestChanged.emit(this.advEntityGroupListRequestModel);
  }

  sortByName() {
    this.isSortedByUidAsc = false;
    this.isSortedByUidDsc = false;
    this.advEntityGroupListRequestModel.sort = 'name';
    if (this.isSortedByNameDsc) {
      this.isSortedByNameAsc = true;
      this.isSortedByNameDsc = false;
      this.advEntityGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByNameAsc) {
      this.isSortedByNameAsc = false;
      this.isSortedByNameDsc = true;
      this.advEntityGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByNameDsc = true;
      this.advEntityGroupListRequestModel.isSortDsc = true;
    }
    this.onEntityGroupListRequestChanged.emit(this.advEntityGroupListRequestModel);
  }

  showDeleteAdvEntityGroupModal(model: AdvEntityGroupModel) {
    this.selectedAdvEntityGroupModel = model;
    this.deleteAdvEntityGroupModal.open().then();
  }

  showEditAdvEntityGroupModal(id: string) {
    this.selectedAdvEntityGroupId = id;
    this.onEntityGroupSelectedForEdit.emit(this.selectedAdvEntityGroupId);
  }

  deleteSelectedAdvEntityGroup() {
    this.entitySearchService.deleteEntityGroup(this.selectedAdvEntityGroupModel.entityGroupMUId).subscribe((data) => {
      if (data && data.success) {
        this.notifyService.success({text: data.message});
        this.onEntityGroupChanged.emit();
      } else {
        this.notifyService.error({text: data.message});
      }
      this.deleteAdvEntityGroupModal.dismiss().then();
    });
  }

  getLastPageNumber(): number {
    let lastPage = this.advEntityGroupListRequestModel.offset + this.advEntityGroupListRequestModel.pageSize;
    if (lastPage > this.advEntityGroupListModel.numOfElements) {
      lastPage = this.advEntityGroupListModel.numOfElements;
    }
    return lastPage;
  }
}
