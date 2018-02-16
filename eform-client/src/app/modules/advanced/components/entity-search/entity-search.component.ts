import {Component, OnInit, ViewChild} from '@angular/core';
import {EntitySearchService} from 'app/services';
import {AdvEntitySearchableGroupListModel, AdvEntitySearchableGroupListRequestModel} from 'app/models/advanced';
import {EditEntitySearchableGroupComponent} from '../edit-entity-searchable-group/edit-entity-searchable-group.component';

@Component({
  selector: 'eform-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.css']
})
export class EntitySearchComponent implements OnInit {
  spinnerStatus: boolean;
  selectedId: number;
  advEntitySearchableGroupListModel: AdvEntitySearchableGroupListModel = new AdvEntitySearchableGroupListModel();
  advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel = new AdvEntitySearchableGroupListRequestModel();
  @ViewChild('editEntitySearchableGroupComponent') editEntitySearchableGroupComponent: EditEntitySearchableGroupComponent;

  constructor(private entitySearchService: EntitySearchService) {
  }

  ngOnInit() {
    this.getEntitySearchableGroupList();
  }

  onSearchChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySearchableGroupListRequestChanged(e: any) {
    this.advEntitySearchableGroupListRequestModel = e;
    this.getEntitySearchableGroupList();
  }

  onEntitySearchableGroupSelectedForEdit(e: any) {
    this.selectedId = e;
    this.editEntitySearchableGroupComponent.createAdvEntitySearchableGroupModal.open();
  }

  showCreateAdvEntitySearchableGroupModal() {
    this.selectedId = 0;
    this.editEntitySearchableGroupComponent.createAdvEntitySearchableGroupModal.open();
  }

  getEntitySearchableGroupList() {
    this.entitySearchService.getEntitySearchableGroupList(this.advEntitySearchableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySearchableGroupListModel = data.model;
      }
    });
  }

  changeSpinnerStatus(e: any) {
    this.spinnerStatus = e;
    if (e === false) {
      this.editEntitySearchableGroupComponent.createAdvEntitySearchableGroupModal.dismiss().then();
      this.selectedId = 0;
    }
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySearchableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySearchableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySearchableGroupListRequestModel.pageIndex = Math.floor(e / this.advEntitySearchableGroupListRequestModel.pageSize);
      }
      this.getEntitySearchableGroupList();
    }
  }
}
