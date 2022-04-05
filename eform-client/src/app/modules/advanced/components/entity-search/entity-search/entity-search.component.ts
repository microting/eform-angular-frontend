import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AdvEntitySearchableGroupModel,
  Paged,
  TableHeaderElementModel,
} from 'src/app/common/models';
import { EntitySearchService } from 'src/app/common/services';
import { EntitySearchStateService } from '../store';
import { AuthStateService } from 'src/app/common/store';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit {
  @ViewChild('modalSearchRemove', { static: true }) modalSearchRemove;
  selectedAdvGroup: AdvEntitySearchableGroupModel = new AdvEntitySearchableGroupModel();
  advEntitySearchableGroupListModel: Paged<AdvEntitySearchableGroupModel> = new Paged<AdvEntitySearchableGroupModel>();

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: 'idTableHeader', sortable: true },
    { name: 'Name', elementId: 'nameTableHeader', sortable: true },
    {
      name: 'Description',
      elementId: 'descriptionTableHeader',
      sortable: true,
    },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private entitySearchService: EntitySearchService,
    private authStateService: AuthStateService,
    public entitySearchStateService: EntitySearchStateService
  ) {}

  ngOnInit() {
    this.getEntitySearchableGroupList();
  }

  getEntitySearchableGroupList() {
    this.entitySearchStateService
      .getEntitySearchableGroupList()
      .subscribe((data) => {
        if (data && data.model) {
          this.advEntitySearchableGroupListModel = data.model;
        }
      });
  }

  changePage(offset: number) {
    this.entitySearchStateService.changePage(offset);
    this.getEntitySearchableGroupList();
  }

  openModalSearchRemove(selectedSearchModel: AdvEntitySearchableGroupModel) {
    this.selectedAdvGroup = selectedSearchModel;
    this.modalSearchRemove.show(this.selectedAdvGroup);
  }

  onSearchChanged(name: string) {
    this.entitySearchStateService.updateNameFilter(name);
    this.getEntitySearchableGroupList();
  }

  sortTable(sort: Sort) {
    this.entitySearchStateService.onSortTable(sort.active);
    this.getEntitySearchableGroupList();
  }

  onPageSizeChanged(pageSize: number) {
    this.entitySearchStateService.updatePageSize(pageSize);
    this.getEntitySearchableGroupList();
  }

  onEntityRemoved() {
    this.entitySearchStateService.onDelete();
    this.getEntitySearchableGroupList();
  }
}
