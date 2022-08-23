import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

@AutoUnsubscribe()
@Component({
  selector: 'app-selectable-list',
  templateUrl: './entity-select.component.html',
  styleUrls: ['./entity-select.component.scss'],
})
export class EntitySelectComponent implements OnInit, OnDestroy{
  @ViewChild('modalSelectRemove', { static: true }) modalSelectRemove;
  @ViewChild('modalSelectCreate', { static: true }) modalSelectCreate;
  @ViewChild('modalSelectEdit', { static: true }) modalSelectEdit;
  advEntitySelectableGroupListModel: Paged<EntityGroupModel> = new Paged<EntityGroupModel>();
  entitySelectRemoveComponentAfterClosedSub$: Subscription;

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
    private entitySelectService: EntitySelectService,
    private authStateService: AuthStateService,
    public entitySelectStateService: EntitySelectStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
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
