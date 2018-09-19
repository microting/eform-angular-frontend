import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel
} from 'src/app/common/models/advanced';
import {EntitySelectService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.scss']
})
export class EntitySelectComponent implements OnInit {
  @ViewChild('modalSelectRemove') modalSelectRemove;
  @ViewChild('modalSelectCreate') modalSelectCreate;
  @ViewChild('modalSelectEdit') modalSelectEdit;
  spinnerStatus: boolean;
  selectedAdvGroup: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  advEntitySelectableGroupListModel: AdvEntitySelectableGroupListModel = new AdvEntitySelectableGroupListModel();
  advEntitySelectableGroupListRequestModel: AdvEntitySelectableGroupListRequestModel
    = new AdvEntitySelectableGroupListRequestModel();
  isSortedByUidAsc = false;
  isSortedByUidDsc = false;
  isSortedByNameAsc = false;
  isSortedByNameDsc = false;

  constructor(private entitySelectService: EntitySelectService) {
  }

  ngOnInit() {
    this.getEntitySelectableGroupList();
  }

  openModalSelectRemove(selectedSelectModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSelectModel;
    this.modalSelectRemove.show(this.selectedAdvGroup);
  }

  openModalSelectCreate() {
    this.modalSelectCreate.show();
  }

  openModalSelectEdit(selectedSelectModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSelectModel;
    this.modalSelectEdit.show(this.selectedAdvGroup.microtingUUID);
  }


  onSelectChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySelectableGroupListRequestChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel = e;
    this.getEntitySelectableGroupList();
  }

  getEntitySelectableGroupList() {
    this.spinnerStatus = true;
    this.entitySelectService.getEntitySelectableGroupList(this.advEntitySelectableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySelectableGroupListModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySelectableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySelectableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySelectableGroupListRequestModel.pageIndex
          = Math.floor(e / this.advEntitySelectableGroupListRequestModel.pageSize);
      }
      this.getEntitySelectableGroupList();
    }
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
    this.getEntitySelectableGroupList();
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
    this.getEntitySelectableGroupList();
  }
}
