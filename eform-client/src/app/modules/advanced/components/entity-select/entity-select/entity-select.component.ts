import { Component, OnInit, ViewChild } from '@angular/core';
import { EntitySelectService } from 'src/app/common/services';
import {
  Paged,
  TableHeaderElementModel,
  AdvEntitySelectableGroupModel,
} from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';
import { EntitySelectStateService } from '../store';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.scss'],
})
export class EntitySelectComponent implements OnInit {
  @ViewChild('modalSelectRemove', { static: true }) modalSelectRemove;
  @ViewChild('modalSelectCreate', { static: true }) modalSelectCreate;
  @ViewChild('modalSelectEdit', { static: true }) modalSelectEdit;
  selectedAdvGroup: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  advEntitySelectableGroupListModel: Paged<AdvEntitySelectableGroupModel> = new Paged<AdvEntitySelectableGroupModel>();

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', sortable: true },
    { name: 'Name', sortable: true },
    { name: 'Description', sortable: true },
    this.userClaims.entitySelectUpdate || this.userClaims.entitySelectDelete
      ? { name: 'Actions', sortable: false }
      : null,
  ];

  constructor(
    private entitySelectService: EntitySelectService,
    private authStateService: AuthStateService,
    public entitySelectStateService: EntitySelectStateService
  ) {}

  ngOnInit() {
    this.getEntitySelectableGroupList();
  }

  getEntitySelectableGroupList() {
    this.entitySelectStateService
      .getEntitySelectableGroupList()
      .subscribe((data) => {
        if (data && data.model) {
          this.advEntitySelectableGroupListModel = data.model;
        }
      });
  }

  openModalSelectRemove(selectedSelectModel: AdvEntitySelectableGroupModel) {
    this.selectedAdvGroup = selectedSelectModel;
    this.modalSelectRemove.show(this.selectedAdvGroup);
  }

  onNameFilterChanged(nameFilter: any) {
    this.entitySelectStateService.updateNameFilter(nameFilter);
    this.getEntitySelectableGroupList();
  }

  changePage(offset: number) {
    this.entitySelectStateService.changePage(offset);
    this.getEntitySelectableGroupList();
  }

  sortTable(sort: Sort) {
    this.entitySelectStateService.onSortTable(sort.active);
    this.getEntitySelectableGroupList();
  }

  onPageSizeChanged(pageSize: number) {
    this.entitySelectStateService.updatePageSize(pageSize);
    this.getEntitySelectableGroupList();
  }

  onEntityRemoved() {
    this.entitySelectStateService.onDelete();
    this.getEntitySelectableGroupList();
  }
}
