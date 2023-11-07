import { Injectable } from '@angular/core';
import { SecurityGroupsService } from 'src/app/common/services';
import {Observable, zip} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  Paged,
  PaginationModel,
  SecurityGroupModel, SecurityGroupsRequestModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectSecurityFilters, selectSecurityPagination} from 'src/app/state/security/security.selector';

@Injectable({ providedIn: 'root' })
export class SecurityStateService {
  private selectSecurityFilters$ = this.store.select(selectSecurityFilters);
  private selectSecurityPagination$ = this.store.select(selectSecurityPagination);
  constructor(
    private store: Store,
    private service: SecurityGroupsService,
  ) {}

  getAllSecurityGroups(): Observable<
    OperationDataResult<Paged<SecurityGroupModel>>
  > {
    let securityGroupsRequestModel = new SecurityGroupsRequestModel();
    zip(this.selectSecurityPagination$, this.selectSecurityFilters$).subscribe(([pagination, filters]) => {
      if (pagination === undefined || filters === undefined) {
        return;
      }
      securityGroupsRequestModel = {
        sort: pagination.sort,
        nameFilter: filters.nameFilter,
        pageIndex: 0,
        pageSize: pagination.pageSize,
        isSortDsc: pagination.isSortDsc,
        offset: pagination.offset,
      }
    }).unsubscribe();
    return this.service
      .getAllSecurityGroups(securityGroupsRequestModel).pipe(
      map((response) => {
        if (response && response.success && response.model) {
          this.store.dispatch({type: '[Security] Update Security Total', payload: {total: response.model.total}});
        }
        return response;
      })
      );
  }

  updateNameFilter(nameFilter: string) {
    let currentPagination: CommonPaginationState;
    this.selectSecurityPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[Security] Update Security Filters', payload: {filters: {nameFilter: nameFilter}}});
  }

  onDelete() {
    let currentPagination: CommonPaginationState;
    this.selectSecurityPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[Security] Update Security Pagination', payload: {pagination: {
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
    this.selectSecurityPagination$.subscribe((pagination) => {
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
    this.store.dispatch({type: '[Security] Update Security Pagination', payload: {pagination: {
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
    this.selectSecurityPagination$.subscribe((pagination) => {
      if (pagination === undefined) {
        return;
      }
      currentPagination = pagination;
    }).unsubscribe();
    this.store.dispatch({type: '[Security] Update Security Pagination', payload: {pagination: {
          sort: currentPagination.sort,
          isSortDsc: currentPagination.isSortDsc,
          offset: pagination.offset,
          pageIndex: currentPagination.pageIndex,
          pageSize: pagination.pageSize,
          total: currentPagination.total,
        }}});
  }
}
