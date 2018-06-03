import {Component, OnInit, ViewChild} from '@angular/core';
import {EntitySelectService} from 'app/services';
import {AdvEntitySelectableGroupListModel, AdvEntitySelectableGroupListRequestModel} from 'app/models';
import {EditEntitySelectableGroupComponent} from '../edit-entity-selectable-group/edit-entity-selectable-group.component';

@Component({
  selector: 'eform-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.css']
})
export class EntitySelectComponent implements OnInit {
  spinnerStatus: boolean;
  selectedId: number;
  advEntitySelectableGroupListModel: AdvEntitySelectableGroupListModel = new AdvEntitySelectableGroupListModel();
  advEntitySelectableGroupListRequestModel: AdvEntitySelectableGroupListRequestModel = new AdvEntitySelectableGroupListRequestModel();
  @ViewChild('editEntitySelectableGroupComponent') editEntitySelectableGroupComponent: EditEntitySelectableGroupComponent;

  constructor(private entitySelectService: EntitySelectService) {
  }

  ngOnInit() {
    this.getEntitySelectableGroupList();
  }

  onSearchChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel.nameFilter = e;
    this.changePage(0);
  }

  onEntitySelectableGroupListRequestChanged(e: any) {
    this.advEntitySelectableGroupListRequestModel = e;
    this.getEntitySelectableGroupList();
  }

  onEntitySelectableGroupSelectedForEdit(e: any) {
    this.selectedId = e;
    this.editEntitySelectableGroupComponent.createAdvEntitySelectableGroupModal.open();
  }

  showCreateAdvEntitySelectableGroupModal() {
    this.selectedId = 0;
    this.editEntitySelectableGroupComponent.createAdvEntitySelectableGroupModal.open();
  }

  getEntitySelectableGroupList() {
    this.entitySelectService.getEntitySelectableGroupList(this.advEntitySelectableGroupListRequestModel).subscribe((data) => {
      if (data && data.model) {
        this.advEntitySelectableGroupListModel = data.model;
      }
    });
  }

  changeSpinnerStatus(e: any) {
    this.spinnerStatus = e;
    if (e === false) {
      this.editEntitySelectableGroupComponent.createAdvEntitySelectableGroupModal.dismiss().then();
      this.selectedId = 0;
    }
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.advEntitySelectableGroupListRequestModel.offset = e;
      if (e === 0) {
        this.advEntitySelectableGroupListRequestModel.pageIndex = 0;
      } else {
        this.advEntitySelectableGroupListRequestModel.pageIndex = Math.floor(e / this.advEntitySelectableGroupListRequestModel.pageSize);
      }
      this.getEntitySelectableGroupList();
    }
  }
}
