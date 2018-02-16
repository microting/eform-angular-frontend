import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableGroupListModel, AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel} from 'app/models/advanced';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EntitySelectService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'eform-entity-select-grid',
  templateUrl: './entity-select-grid.component.html'
})
export class EntitySelectableGridComponent {
  @Input() advEntitySelectableGroupListModel: AdvEntitySelectableGroupListModel;
  @Input() advEntitySelectableGroupListRequestModel: AdvEntitySelectableGroupListRequestModel;
  @Output() onEntitySelectableGroupListRequestChanged = new EventEmitter<AdvEntitySelectableGroupListRequestModel>();
  @Output() onEntitySelectableGroupChanged = new EventEmitter<void>();
  @Output() onEntitySelectableGroupSelectedForEdit = new EventEmitter<string>();
  @ViewChild('deleteAdvEntitySelectableGroupModal') deleteAdvEntitySelectableGroupModal: ModalComponent;
  selectedAdvEntitySelectableGroupId: string;
  selectedAdvEntitySelectableGroupModel: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel;
  isSortedByUidAsc = false;
  isSortedByUidDsc = false;
  isSortedByNameAsc = false;
  isSortedByNameDsc = false;

  constructor(private entitySelectService: EntitySelectService, private notifyService: NotifyService) {
  }

  sortByUid() {
    this.isSortedByNameAsc = false;
    this.isSortedByNameDsc = false;
    this.advEntitySelectableGroupListRequestModel.sort = 'id';
    if (this.isSortedByUidDsc) {
      this.isSortedByUidAsc = true;
      this.isSortedByUidDsc = false;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByUidAsc) {
      this.isSortedByUidAsc = false;
      this.isSortedByUidDsc = true;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByUidDsc = true;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = true;
    }
    this.onEntitySelectableGroupListRequestChanged.emit(this.advEntitySelectableGroupListRequestModel);
  }

  sortByName() {
    this.isSortedByUidAsc = false;
    this.isSortedByUidDsc = false;
    this.advEntitySelectableGroupListRequestModel.sort = 'name';
    if (this.isSortedByNameDsc) {
      this.isSortedByNameAsc = true;
      this.isSortedByNameDsc = false;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByNameAsc) {
      this.isSortedByNameAsc = false;
      this.isSortedByNameDsc = true;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByNameDsc = true;
      this.advEntitySelectableGroupListRequestModel.isSortDsc = true;
    }
    this.onEntitySelectableGroupListRequestChanged.emit(this.advEntitySelectableGroupListRequestModel);
  }

  showDeleteAdvEntitySelectableGroupModal(model: AdvEntitySelectableGroupModel) {
    this.selectedAdvEntitySelectableGroupModel = model;
    this.deleteAdvEntitySelectableGroupModal.open().then();
  }

  showEditAdvEntitySelectableGroupModal(id: string) {
    this.selectedAdvEntitySelectableGroupId = id;
    this.onEntitySelectableGroupSelectedForEdit.emit(this.selectedAdvEntitySelectableGroupId);
  }

  deleteSelectedAdvEntitySelectableGroup() {
    this.entitySelectService.deleteEntitySelectableGroup(this.selectedAdvEntitySelectableGroupModel.entityGroupMUId).subscribe((data) => {
      if (data && data.success) {
        this.notifyService.success({text: data.message});
        this.onEntitySelectableGroupChanged.emit();
      } else {
        this.notifyService.error({text: data.message});
      }
      this.deleteAdvEntitySelectableGroupModal.dismiss().then();
    });
  }

  getLastPageNumber(): number {
    let lastPage = this.advEntitySelectableGroupListRequestModel.offset + this.advEntitySelectableGroupListRequestModel.pageSize;
    if (lastPage > this.advEntitySelectableGroupListModel.numOfElements) {
      lastPage = this.advEntitySelectableGroupListModel.numOfElements;
    }
    return lastPage;
  }
}
