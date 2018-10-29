import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AdvEntitySearchableGroupListModel,
  AdvEntitySearchableGroupListRequestModel, AdvEntitySelectableGroupModel
} from 'src/app/common/models/advanced';
import {EntitySearchService} from 'src/app/common/services/advanced';
import {AuthService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss']
})
export class EntitySearchComponent implements OnInit {
  @ViewChild('modalSearchRemove') modalSearchRemove;
  @ViewChild('modalSearchCreate') modalSearchCreate;
  @ViewChild('modalSearchEdit') modalSearchEdit;
  spinnerStatus: boolean;
  selectedAdvGroup: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel = new AdvEntitySearchableGroupListModel();
  advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel
    = new AdvEntitySearchableGroupListRequestModel();
  isSortedByUidAsc = false;
  isSortedByUidDsc = false;
  isSortedByNameAsc = false;
  isSortedByNameDsc = false;

  get userClaims() { return this.authService.userClaims; }

  constructor(private entitySearchService: EntitySearchService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getEntitySearchableGroupList();
  }

  openModalSearchRemove(selectedSearchModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchRemove.show(this.selectedAdvGroup);
  }

  openModalSearchCreate() {
    this.modalSearchCreate.show();
  }

  openModalSearchEdit(selectedSearchModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchEdit.show(this.selectedAdvGroup.microtingUUID);
  }


  onSearchChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySearchableGroupListRequestChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel = e;
    this.getEntitySearchableGroupList();
  }

  getEntitySearchableGroupList() {
    this.spinnerStatus = true;
    this.entitySearchService.getEntitySearchableGroupList(this.advEntitySearchableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySearchableGroupListModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySearchableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySearchableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySearchableGroupListRequestModel.pageIndex
          = Math.floor(e / this.advEntitySearchableGroupListRequestModel.pageSize);
      }
      this.getEntitySearchableGroupList();
    }
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
    this.getEntitySearchableGroupList();
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
    this.getEntitySearchableGroupList();
  }
}
