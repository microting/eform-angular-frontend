import {Component, OnDestroy, OnInit} from '@angular/core';
import { EntitySelectService } from 'src/app/common/services';
import {
  Paged,
  EntityGroupModel,
  PaginationModel,
} from 'src/app/common/models';
import { AuthStateService } from 'src/app/common/store';
import { EntitySelectStateService } from '../store';
import {Sort} from '@angular/material/sort';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySelectRemoveComponent} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {selectCurrentUserClaimsEntitySelectCreate} from 'src/app/state/auth/auth.selector';

@AutoUnsubscribe()
@Component({
  selector: 'app-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.scss'],
})
export class EntitySelectComponent implements OnInit, OnDestroy{
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
    {header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  public selectCurrentUserClaimsEntitySelectCreate$ = this.authStore.select(selectCurrentUserClaimsEntitySelectCreate);
  public selectCurrentUserClaimsEntitySelectUpdate$ = this.authStore.select(selectCurrentUserClaimsEntitySelectCreate);
  public selectCurrentUserClaimsEntitySelectDelete$ = this.authStore.select(selectCurrentUserClaimsEntitySelectCreate);

  constructor(
    private authStore: Store,
    public entitySelectStateService: EntitySelectStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
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
