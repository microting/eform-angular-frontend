import {Injectable} from '@angular/core';
import {EntitySelectService} from 'src/app/common/services';
import {
  AdvEntitySelectableGroupListRequestModel, CommonPaginationState,
  EntityGroupModel,
  OperationDataResult,
  Paged,
  PaginationModel,
} from 'src/app/common/models';
import {Observable, zip} from 'rxjs';
import {updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  selectEntitySelectFilters,
  selectEntitySelectPagination
} from 'src/app/state/entity-select/entity-select.selector';

@Injectable({providedIn: 'root'})
export class EntitySelectStateService {
  private selectEntitySelectFilters$ = this.store.select(selectEntitySelectFilters);
  private selectEntitySelectPagination$ = this.store.select(selectEntitySelectPagination);
  constructor(
    private store: Store,
    private service: EntitySelectService,
  ) {
  }

  getEntitySelectableGroupList(): Observable<OperationDataResult<Paged<EntityGroupModel>>> {
    let advEntitySelectableGroupListRequestModel = new AdvEntitySelectableGroupListRequestModel();
    zip(this.selectEntitySelectPagination$, this.selectEntitySelectFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      advEntitySelectableGroupListRequestModel = {
        sort: pagination.sort,
        nameFilter: filters.nameFilter,
        pageIndex: 0,
        pageSize: pagination.pageSize,
        isSortDsc: pagination.isSortDsc,
        offset: pagination.offset,
      }
    }).unsubscribe();
    return this.service
      .getEntitySelectableGroupList(advEntitySelectableGroupListRequestModel);
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch({type: '[EntitySelect] Update EntitySelect Filters', payload: {filters: {nameFilter: nameFilter}}})
  }

  onDelete() {
    let currentPagination: CommonPaginationState;
    this.selectEntitySelectPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EntitySelect] Update EntitySelect Pagination', payload: {pagination: {
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
    this.selectEntitySelectPagination$.subscribe((pagination) => {
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
    this.store.dispatch({type: '[EntitySelect] Update EntitySelect Pagination', payload: {pagination: {
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
    this.selectEntitySelectPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[EntitySelect] Update EntitySelect Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: pagination.pageSize,
          total: currentPagination.total,
        }}});
  }
}
