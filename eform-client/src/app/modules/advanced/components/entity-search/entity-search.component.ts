import {Component, OnInit, ViewChild} from '@angular/core';
import {EntitySearchService} from 'app/services';
import {AdvEntityGroupListModel, AdvEntityGroupListRequestModel} from 'app/models/advanced';
import {EditEntityGroupComponent} from '../edit-entity-group/edit-entity-group.component';

@Component({
  selector: 'eform-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.css']
})
export class EntitySearchComponent implements OnInit {
  spinnerStatus: boolean;
  selectedId: number;
  advEntityGroupListModel: AdvEntityGroupListModel = new AdvEntityGroupListModel();
  advEntityGroupListRequestModel: AdvEntityGroupListRequestModel = new AdvEntityGroupListRequestModel();
  @ViewChild('editEntityGroupComponent') editEntityGroupComponent: EditEntityGroupComponent;

  constructor(private entitySearchService: EntitySearchService) {
  }

  ngOnInit() {
    this.getEntityGroupList();
  }

  onSearchChanged(e: any) {
    this.advEntityGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntityGroupListRequestChanged(e: any) {
    this.advEntityGroupListRequestModel = e;
    this.getEntityGroupList();
  }

  onEntityGroupSelectedForEdit(e: any) {
    this.selectedId = e;
    this.editEntityGroupComponent.createAdvEntityGroupModal.open();
  }

  showCreateAdvEntityGroupModal() {
    this.selectedId = 0;
    this.editEntityGroupComponent.createAdvEntityGroupModal.open();
  }

  getEntityGroupList() {
    this.entitySearchService.getEntityGroupList(this.advEntityGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntityGroupListModel = data.model;
      }
    });
  }

  changeSpinnerStatus(e: any) {
    this.spinnerStatus = e;
    if (e === false) {
      this.editEntityGroupComponent.createAdvEntityGroupModal.dismiss().then();
      this.selectedId = 0;
    }
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntityGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntityGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntityGroupListRequestModel.pageIndex = Math.floor(e / this.advEntityGroupListRequestModel.pageSize);
      }
      this.getEntityGroupList();
    }
  }
}
