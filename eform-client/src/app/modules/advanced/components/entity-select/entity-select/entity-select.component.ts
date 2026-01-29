import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  Paged,
  EntityGroupModel,
  PaginationModel,
} from 'src/app/common/models';
import {EntitySelectStateService} from '../store';
import {Sort} from '@angular/material/sort';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySelectRemoveComponent} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
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
import { EformNewSubheaderComponent } from '../../../../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { EformPaginationComponent } from '../../../../../common/modules/eform-shared/components/eform-pagination/eform-pagination.component';

@AutoUnsubscribe()
@Component({
    selector: 'app-selectable-list',
    templateUrl: './entity-select.component.html',
    styleUrls: ['./entity-select.component.scss'],
    imports: [EformNewSubheaderComponent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatIcon, MatSuffix, NgIf, MatTooltip, RouterLink, MtxGrid, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem, EformPaginationComponent, AsyncPipe, TranslatePipe]
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
