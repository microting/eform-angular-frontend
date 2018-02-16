import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AdvEntitySearchableGroupListModel, AdvEntitySearchableGroupListRequestModel, AdvEntitySearchableGroupModel} from 'app/models/advanced';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {EntitySearchService} from 'app/services';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'eform-entity-search-grid',
  templateUrl: './entity-search-grid.component.html'
})
export class EntitySearchableGridComponent {
  @Input() advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel;
  @Input() advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel;
  @Output() onEntitySearchableGroupListRequestChanged = new EventEmitter<AdvEntitySearchableGroupListRequestModel>();
  @Output() onEntitySearchableGroupChanged = new EventEmitter<void>();
  @Output() onEntitySearchableGroupSelectedForEdit = new EventEmitter<string>();
  @ViewChild('deleteAdvEntitySearchableGroupModal') deleteAdvEntitySearchableGroupModal: ModalComponent;
  selectedAdvEntitySearchableGroupId: string;
  selectedAdvEntitySearchableGroupModel: AdvEntitySearchableGroupModel = new AdvEntitySearchableGroupModel;
  isSortedByUidAsc = false;
  isSortedByUidDsc = false;
  isSortedByNameAsc = false;
  isSortedByNameDsc = false;

  constructor(private entitySearchService: EntitySearchService, private notifyService: NotifyService) {
  }

  sortByUid() {
    this.isSortedByNameAsc = false;
    this.isSortedByNameDsc = false;
    this.advEntitySearchableGroupListRequestModel.sort = 'id';
    if (this.isSortedByUidDsc) {
      this.isSortedByUidAsc = true;
      this.isSortedByUidDsc = false;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByUidAsc) {
      this.isSortedByUidAsc = false;
      this.isSortedByUidDsc = true;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByUidDsc = true;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = true;
    }
    this.onEntitySearchableGroupListRequestChanged.emit(this.advEntitySearchableGroupListRequestModel);
  }

  sortByName() {
    this.isSortedByUidAsc = false;
    this.isSortedByUidDsc = false;
    this.advEntitySearchableGroupListRequestModel.sort = 'name';
    if (this.isSortedByNameDsc) {
      this.isSortedByNameAsc = true;
      this.isSortedByNameDsc = false;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = false;
    } else if (this.isSortedByNameAsc) {
      this.isSortedByNameAsc = false;
      this.isSortedByNameDsc = true;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = true;
    } else {
      this.isSortedByNameDsc = true;
      this.advEntitySearchableGroupListRequestModel.isSortDsc = true;
    }
    this.onEntitySearchableGroupListRequestChanged.emit(this.advEntitySearchableGroupListRequestModel);
  }

  showDeleteAdvEntitySearchableGroupModal(model: AdvEntitySearchableGroupModel) {
    this.selectedAdvEntitySearchableGroupModel = model;
    this.deleteAdvEntitySearchableGroupModal.open().then();
  }

  showEditAdvEntitySearchableGroupModal(id: string) {
    this.selectedAdvEntitySearchableGroupId = id;
    this.onEntitySearchableGroupSelectedForEdit.emit(this.selectedAdvEntitySearchableGroupId);
  }

  deleteSelectedAdvEntitySearchableGroup() {
    this.entitySearchService.deleteEntitySearchableGroup(this.selectedAdvEntitySearchableGroupModel.entityGroupMUId).subscribe((data) => {
      if (data && data.success) {
        this.notifyService.success({text: data.message});
        this.onEntitySearchableGroupChanged.emit();
      } else {
        this.notifyService.error({text: data.message});
      }
      this.deleteAdvEntitySearchableGroupModal.dismiss().then();
    });
  }

  getLastPageNumber(): number {
    let lastPage = this.advEntitySearchableGroupListRequestModel.offset + this.advEntitySearchableGroupListRequestModel.pageSize;
    if (lastPage > this.advEntitySearchableGroupListModel.numOfElements) {
      lastPage = this.advEntitySearchableGroupListModel.numOfElements;
    }
    return lastPage;
  }
}
