import { Component, OnInit, ViewChild } from '@angular/core';
import { AdvEntitySelectableGroupModel } from 'src/app/common/models/advanced';
import { EntitySelectService } from 'src/app/common/services/advanced';
import { Paged, TableHeaderElementModel } from 'src/app/common/models';
import { EntitySelectStateService } from '../store/entity-select-state.service';
import { AuthStateService } from 'src/app/common/store';

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
    { name: 'Id', elementId: '', sortable: true },
    { name: 'Name', elementId: '', sortable: true },
    { name: 'Description', elementId: '', sortable: true },
    this.userClaims.entitySelectUpdate || this.userClaims.entitySelectDelete
      ? { name: 'Actions', elementId: '', sortable: false }
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
    this.changePage(0);
  }

  changePage(offset: number) {
    this.entitySelectStateService.changePage(offset);
    this.getEntitySelectableGroupList();
  }

  sortTable(sort: string) {
    this.entitySelectStateService.onSortTable(sort);
    this.getEntitySelectableGroupList();
  }

  onPageSizeChanged(pageSize: number) {
    this.entitySelectStateService.updatePageSize(pageSize);
    this.getEntitySelectableGroupList();
  }

  onEntityRemoved() {
    this.entitySelectStateService.onDelete(
      this.advEntitySelectableGroupListModel.total - 1
    );
    this.getEntitySelectableGroupList();
  }
}
