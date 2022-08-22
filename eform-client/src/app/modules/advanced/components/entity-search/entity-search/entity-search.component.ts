import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  EntityGroupModel,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import { EntitySearchService } from 'src/app/common/services';
import { EntitySearchStateService } from '../store';
import { AuthStateService } from 'src/app/common/store';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySearchRemoveComponent,} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit, OnDestroy{
  advEntitySearchableGroupListModel: Paged<EntityGroupModel> = new Paged<EntityGroupModel>();
  entitySearchRemoveComponentAfterClosedSub$: Subscription;

  get userClaims() {
    return this.authStateService.currentUserClaims;
  }

  tableHeaders: MtxGridColumn[] = [
    {header: 'Id', field: 'microtingUUID', sortProp: {id: 'Id'}, sortable: true},
    {header: 'Name', sortProp: {id: 'Name'}, field: 'name', sortable: true},
    {
      header: 'Description',
      field: 'description',
      sortable: true,
      sortProp: {id: 'Description'}
    },
    {header: 'Actions', field: 'actions'},
  ]

  constructor(
    private entitySearchService: EntitySearchService,
    private authStateService: AuthStateService,
    public entitySearchStateService: EntitySearchStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
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

  openModalSearchRemove(selectedSearchModel: EntityGroupModel) {
    this.entitySearchRemoveComponentAfterClosedSub$ = this.dialog.open(EntitySearchRemoveComponent,
      dialogConfigHelper(this.overlay, selectedSearchModel))
      .afterClosed().subscribe(data => data ? this.onEntityRemoved() : undefined);
  }

  onSearchChanged(name: string) {
    this.entitySearchStateService.updateNameFilter(name);
    this.getEntitySearchableGroupList();
  }

  sortTable(sort: Sort) {
    this.entitySearchStateService.onSortTable(sort.active);
    this.getEntitySearchableGroupList();
  }

  onEntityRemoved() {
    this.entitySearchStateService.onDelete();
    this.getEntitySearchableGroupList();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.entitySearchStateService.updatePagination(paginationModel);
    this.getEntitySearchableGroupList();
  }

  ngOnDestroy(): void {
  }
}
