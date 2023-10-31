import { Injectable } from '@angular/core';
import { EntitySearchService } from 'src/app/common/services';
import {
  AdvEntitySearchableGroupListRequestModel, CommonPaginationState,
  EntityGroupModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable, zip} from 'rxjs';
import { updateTableSort } from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  selectEntitySearchFilters,
  selectEntitySearchPagination
} from 'src/app/state/entity-search/entity-search.selector';

@Injectable({ providedIn: 'root' })
export class EntitySearchStateService {
  private selectEntitySearchFilters$ = this.store.select(selectEntitySearchFilters);
  private selectEntitySearchPagination$ = this.store.select(selectEntitySearchPagination);
  constructor(
    private service: EntitySearchService,
    private store: Store,
  ) {}

  getEntitySearchableGroupList(): Observable<
    OperationDataResult<Paged<EntityGroupModel>>
  > {
    let advEntitySearchableGroupListRequestModel = new AdvEntitySearchableGroupListRequestModel();
    zip(this.selectEntitySearchPagination$, this.selectEntitySearchFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      advEntitySearchableGroupListRequestModel = {
        sort: pagination.sort,
        nameFilter: filters.nameFilter,
        pageIndex: 0,
        pageSize: pagination.pageSize,
        isSortDsc: pagination.isSortDsc,
        offset: pagination.offset,
      }
    }).unsubscribe();
    return this.service
      .getEntitySearchableGroupList(advEntitySearchableGroupListRequestModel);
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch({type: '[EntitySearch] Update EntitySearch Filters', payload: {filters: {nameFilter: nameFilter}}});
  }

  onDelete() {
    let currentPagination: CommonPaginationState;
    this.selectEntitySearchPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EntitySearch] Update EntitySearch Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: currentPagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total - 1,
        }}});
  }

  onSortTable(sort: string) {
    let currentPagination: CommonPaginationState;
    this.selectEntitySearchPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    const localPageSettings = updateTableSort(
      sort,
      currentPagination.sort,
      currentPagination.isSortDsc
    );
    this.store.dispatch({type: '[EntitySearch] Update EntitySearch Pagination', payload: {pagination: {
          sort: localPageSettings.sort,
          isSortDsc: localPageSettings.isSortDsc,
          offset: currentPagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: currentPagination.pageSize,
          total: currentPagination.total,
        }}});
  }

  updatePagination(pagination: PaginationModel) {
    let currentPagination: CommonPaginationState;
    this.selectEntitySearchPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EntitySearch] Update EntitySearch Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: pagination.pageSize,
          total: currentPagination.total,
        }}});
  }
}
