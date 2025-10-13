import { Injectable, inject } from '@angular/core';
import {EntitySearchService} from 'src/app/common/services';
import {
  AdvEntitySearchableGroupListRequestModel,
  CommonPaginationState,
  EntityGroupModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable} from 'rxjs';
import {updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  EntitySearchFiltration,
  selectEntitySearchFilters,
  selectEntitySearchPagination,
  updateEntitySearchFilters,
  updateEntitySearchPagination,
  updateEntitySearchTotal
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class EntitySearchStateService {
  private service = inject(EntitySearchService);
  private store = inject(Store);

  private selectEntitySearchFilters$ = this.store.select(selectEntitySearchFilters);
  private selectEntitySearchPagination$ = this.store.select(selectEntitySearchPagination);
  currentPagination: CommonPaginationState;
  currentFilters: EntitySearchFiltration;

  constructor() {
    this.selectEntitySearchPagination$.subscribe(x => this.currentPagination = x);
    this.selectEntitySearchFilters$.subscribe(x => this.currentFilters = x);
  }

  getEntitySearchableGroupList(): Observable<OperationDataResult<Paged<EntityGroupModel>>> {
    const advEntitySearchableGroupListRequestModel: AdvEntitySearchableGroupListRequestModel = {
      sort: this.currentPagination.sort,
      nameFilter: this.currentFilters.nameFilter,
      pageIndex: 0,
      pageSize: this.currentPagination.pageSize,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
    };
    return this.service
      .getEntitySearchableGroupList(advEntitySearchableGroupListRequestModel);
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateEntitySearchFilters({filters: {nameFilter: nameFilter}}));
  }

  onDelete() {
    this.store.dispatch(updateEntitySearchTotal({total: this.currentPagination.total - 1}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );

    this.store.dispatch(updateEntitySearchPagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSettings.sort,
        isSortDsc: localPageSettings.isSortDsc,
      }
    }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(updateEntitySearchPagination({
      pagination: {
        ...this.currentPagination,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      }
    }));
  }
}
