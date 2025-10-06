import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Paged,
  EntityGroupModel,
  PaginationModel,
} from 'src/app/common/models';
import {EntitySelectStateService} from '../store';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySelectRemoveComponent} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  selectCurrentUserClaimsEntitySelectCreate,
  selectCurrentUserClaimsEntitySelectDelete,
  selectCurrentUserClaimsEntitySelectUpdate,
  selectEntitySelectIsSortDsc,
  selectEntitySelectNameFilter,
  selectEntitySelectPagination,
  selectEntitySelectSort,
  updateEntitySelectTotal
} from 'src/app/state';

@AutoUnsubscribe()
@Component({
    selector: 'app-selectable-list',
    templateUrl: './entity-select.component.html',
    styleUrls: ['./entity-select.component.scss'],
    standalone: false
})
export class EntitySelectComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  entitySelectStateService = inject(EntitySelectStateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private translateService = inject(TranslateService);

  advEntitySelectableGroupListModel: Paged<EntityGroupModel> = new Paged<EntityGroupModel>();
  entitySelectRemoveComponentAfterClosedSub$: Subscription;

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'microtingUUID', sortProp: {id: 'Id'}, sortable: true, class: 'id'},
    {header: this.translateService.stream('Name'), sortProp: {id: 'Name'}, field: 'name', sortable: true, class: 'name'},
    {
      header: this.translateService.stream('Description'),
      field: 'description',
      sortable: true,
      sortProp: {id: 'Description'},
      class: 'description'
    },
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectCurrentUserClaimsEntitySelectCreate$ = this.store.select(selectCurrentUserClaimsEntitySelectCreate);
  public selectCurrentUserClaimsEntitySelectUpdate$ = this.store.select(selectCurrentUserClaimsEntitySelectUpdate);
  public selectCurrentUserClaimsEntitySelectDelete$ = this.store.select(selectCurrentUserClaimsEntitySelectDelete);
  public selectEntitySelectSort$ = this.store.select(selectEntitySelectSort);
  public selectEntitySelectIsSortDsc$ = this.store.select(selectEntitySelectIsSortDsc);
  public selectEntitySelectNameFilter$ = this.store.select(selectEntitySelectNameFilter);
  public selectEntitySelectPagination$ = this.store.select(selectEntitySelectPagination);

  ngOnInit() {
    this.getEntitySelectableGroupList();
  }

  getEntitySelectableGroupList() {
    this.entitySelectStateService
      .getEntitySelectableGroupList()
      .subscribe((data) => {
        if (data && data.model) {
          this.advEntitySelectableGroupListModel = data.model;
          this.store.dispatch(updateEntitySelectTotal({total: data.model.total}));
        }
      });
  }

  openModalSelectRemove(selectedSelectModel: EntityGroupModel) {
    this.entitySelectRemoveComponentAfterClosedSub$ = this.dialog.open(EntitySelectRemoveComponent,
      dialogConfigHelper(this.overlay, selectedSelectModel))
      .afterClosed().subscribe(data => data ? this.onEntityRemoved() : undefined);
  }

  onNameFilterChanged(nameFilter: any) {
    this.entitySelectStateService.updateNameFilter(nameFilter);
    this.getEntitySelectableGroupList();
  }

  sortTable(sort: Sort) {
    this.entitySelectStateService.onSortTable(sort.active);
    this.getEntitySelectableGroupList();
  }

  onEntityRemoved() {
    this.entitySelectStateService.onDelete();
    this.getEntitySelectableGroupList();
  }

  onPaginationChanged(paginationModel: PaginationModel) {
    this.entitySelectStateService.updatePagination(paginationModel);
    this.getEntitySelectableGroupList();
  }

  ngOnDestroy(): void {
  }
}
