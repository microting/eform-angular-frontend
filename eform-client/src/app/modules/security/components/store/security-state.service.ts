import { Injectable, inject } from '@angular/core';
import {SecurityGroupsService} from 'src/app/common/services';
import {Observable, tap} from 'rxjs';
import {
  CommonPaginationState,
  OperationDataResult,
  Paged,
  PaginationModel,
  SecurityGroupModel,
  SecurityGroupsRequestModel,
} from 'src/app/common/models';
import {updateTableSort} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {
  SecurityFilters,
  selectSecurityFilters,
  selectSecurityPagination,
  updateSecurityFilters,
  updateSecurityPagination,
  updateSecurityTotal,
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class SecurityStateService {
  private store = inject(Store);
  private service = inject(SecurityGroupsService);

  private selectSecurityFilters$ = this.store.select(selectSecurityFilters);
  private selectSecurityPagination$ = this.store.select(selectSecurityPagination);
  currentPagination: CommonPaginationState;
  currentFilters: SecurityFilters;

  constructor() {
    this.selectSecurityPagination$.subscribe(x => this.currentPagination = x);
    this.selectSecurityFilters$.subscribe(x => this.currentFilters = x);
  }

  getAllSecurityGroups(): Observable<OperationDataResult<Paged<SecurityGroupModel>>> {
    let securityGroupsRequestModel: SecurityGroupsRequestModel = {
      sort: this.currentPagination.sort,
      nameFilter: this.currentFilters.nameFilter,
      pageIndex: 0,
      pageSize: this.currentPagination.pageSize,
      isSortDsc: this.currentPagination.isSortDsc,
      offset: this.currentPagination.offset,
    };
    return this.service
      .getAllSecurityGroups(securityGroupsRequestModel).pipe(
        tap((response) => {
          if (response && response.success && response.model) {
            this.store.dispatch(updateSecurityTotal({total: response.model.total}));
          }
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.dispatch(updateSecurityFilters({filters: {nameFilter: nameFilter}}));
  }

  onDelete() {
    this.store.dispatch(updateSecurityTotal({total: this.currentPagination.total - 1}));
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.currentPagination.sort,
      this.currentPagination.isSortDsc
    );
    this.store.dispatch(updateSecurityPagination({
      pagination: {
        ...this.currentPagination,
        sort: localPageSettings.sort,
        isSortDsc: localPageSettings.isSortDsc,
      }
    }));
  }

  updatePagination(pagination: PaginationModel) {

    this.store.dispatch(updateSecurityPagination({
      pagination: {
        ...this.currentPagination,
        offset: pagination.offset,
        pageSize: pagination.pageSize,
      }
    }));
  }
}
