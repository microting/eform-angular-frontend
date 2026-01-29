import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import {
  EntityGroupModel,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {EntitySearchStateService} from '../store';
import {Sort} from '@angular/material/sort';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {EntitySearchRemoveComponent,} from '../';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {
  selectEntitySearchIsSortDsc,
  selectCurrentUserClaimsEntitySearchCreate,
  selectEntitySearchNameFilter,
  selectEntitySearchPagination,
  selectEntitySearchSort,
  updateEntitySearchTotal
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
    selector: 'app-searchable-list',
    templateUrl: './entity-search.component.html',
    styleUrls: ['./entity-search.component.scss'],
    imports: [EformNewSubheaderComponent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatIcon, MatSuffix, NgIf, MatTooltip, RouterLink, MtxGrid, MatIconButton, MatMenuTrigger, MatMenu, MatMenuItem, EformPaginationComponent, AsyncPipe, TranslatePipe]
})
export class EntitySearchComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  entitySearchStateService = inject(EntitySearchStateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

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
          // Trigger change detection after async update
          this.cdr.detectChanges();
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
