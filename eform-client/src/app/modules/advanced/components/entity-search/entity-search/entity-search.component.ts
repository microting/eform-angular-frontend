import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  EntityGroupModel,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {EntitySearchStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySearchRemoveComponent,} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  selectEntitySearchIsSortDsc,
  selectCurrentUserClaimsEntitySearchCreate,
  selectEntitySearchNameFilter,
  selectEntitySearchPagination,
  selectEntitySearchSort,
  updateEntitySearchTotal
} from 'src/app/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit, OnDestroy {
  advEntitySearchableGroupListModel: Paged<EntityGroupModel> = new Paged<EntityGroupModel>();
  entitySearchRemoveComponentAfterClosedSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'microtingUUID', sortProp: {id: 'Id'}, sortable: true},
    {header: this.translateService.stream('Name'), sortProp: {id: 'Name'}, field: 'name', sortable: true},
    {
      header: this.translateService.stream('Description'),
      field: 'description',
      sortable: true,
      sortProp: {id: 'Description'}
    },
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectCurrentUserClaimsEntitySearchCreate$ = this.store.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectCurrentUserClaimsEntitySearchUpdate$ = this.store.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectCurrentUserClaimsEntitySearchDelete$ = this.store.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectEntitySearchNameFilter$ = this.store.select(selectEntitySearchNameFilter);
  public selectEntitySearchSort$ = this.store.select(selectEntitySearchSort);
  public selectEntitySearchIsSortDsc$ = this.store.select(selectEntitySearchIsSortDsc);
  public selectEntitySearchPagination$ = this.store.select(selectEntitySearchPagination);

  constructor(
    private store: Store,
    public entitySearchStateService: EntitySearchStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.getEntitySearchableGroupList();
  }

  getEntitySearchableGroupList() {
    this.entitySearchStateService
      .getEntitySearchableGroupList()
      .subscribe((data) => {
        if (data && data.model) {
          this.advEntitySearchableGroupListModel = data.model;
          this.store.dispatch(updateEntitySearchTotal({total: data.model.total}));
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
