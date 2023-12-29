import {Injectable} from '@angular/core';
import {EntitySelectService} from 'src/app/common/services';
import {
  AdvEntitySelectableGroupListRequestModel,
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
  EntitySelectFilters,
  selectEntitySelectFilters,
  selectEntitySelectPagination,
  updateEntitySelectFilters,
  updateEntitySelectPagination,
  updateEntitySelectTotal
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class EntitySelectStateService {
  private selectEntitySelectFilters$ = this.store.select(selectEntitySelectFilters);
  private selectEntitySelectPagination$ = this.store.select(selectEntitySelectPagination);
  currentPagination: CommonPaginationState;
  currentFilters: EntitySelectFilters;

  constructor(
    private store: Store,
    private service: EntitySelectService,
  ) {
    this.selectEntitySelectPagination$.subscribe(x => this.currentPagination = x);
    this.selectEntitySelectFilters$.subscribe(x => this.currentFilters = x);
  }

  getEntitySelectableGroupList(): Observable<OperationDataResult<Paged<EntityGroupModel>>> {
    let advEntitySelectableGroupListRequestModel: AdvEntitySelectableGroupListRequestModel = {
      sort: this.currentPagination.sort,
      nameFilter: this.currentFilters.nameFilter,
      pageIndex: 0,
      pageSize: this.currentPagination.pageSize,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
    };
    return this.service
      .getEntitySelectableGroupList(advEntitySelectableGroupListRequestModel);
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateEntitySelectFilters({filters: {nameFilter: nameFilter}}));
  }

  onDelete() {
    this.store.dispatch(updateEntitySelectTotal({total: this.currentPagination.total - 1}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateEntitySelectPagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSettings.sort,
        isSortDsc: localPageSettings.isSortDsc
      }
    }));
  }

  updatePagination(pagination: PaginationModel) {
    this.store.dispatch(updateEntitySelectPagination({
      pagination: {
        ...this.currentPagination,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      }
    }));
  }
}
