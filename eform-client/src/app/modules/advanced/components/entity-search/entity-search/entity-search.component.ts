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
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {selectCurrentUserClaimsEntitySearchCreate} from 'src/app/state/auth/auth.selector';
import {
  selectEntitySearchIsSortDsc,
  selectEntitySearchNameFilter, selectEntitySearchPagination,
  selectEntitySearchSort
} from 'src/app/state/entity-search/entity-search.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-searchable-list',
  templateUrl: './entity-search.component.html',
  styleUrls: ['./entity-search.component.scss'],
})
export class EntitySearchComponent implements OnInit, OnDestroy{
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
    {header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectCurrentUserClaimsEntitySearchCreate$ = this.authStore.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectCurrentUserClaimsEntitySearchUpdate$ = this.authStore.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectCurrentUserClaimsEntitySearchDelete$ = this.authStore.select(selectCurrentUserClaimsEntitySearchCreate);
  public selectEntitySearchNameFilter$ = this.authStore.select(selectEntitySearchNameFilter);
  public selectEntitySearchSort$ = this.authStore.select(selectEntitySearchSort);
  public selectEntitySearchIsSortDsc$ = this.authStore.select(selectEntitySearchIsSortDsc);
  public selectEntitySearchPagination$ = this.authStore.select(selectEntitySearchPagination);

  constructor(
    private authStore: Store,
    public entitySearchStateService: EntitySearchStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
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
          this.authStore.dispatch({type: '[EntitySearch] Update EntitySearch Total', payload: {total: data.model.total}});
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
