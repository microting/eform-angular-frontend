import { Injectable } from '@angular/core';
import { SecurityGroupsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import { SecurityQuery, SecurityStore } from './';
import {
  OperationDataResult,
  Paged,
  PaginationModel,
  SecurityGroupModel,
} from 'src/app/common/models';
import { updateTableSort, getOffset } from 'src/app/common/helpers';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SecurityStateService {
  constructor(
    private store: SecurityStore,
    private service: SecurityGroupsService,
    private query: SecurityQuery
  ) {}

  getAllSecurityGroups(): Observable<
    OperationDataResult<Paged<SecurityGroupModel>>
  > {
    return this.service
      .getAllSecurityGroups({
        ...this.query.pageSetting.pagination,
        ...this.query.pageSetting.filters,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              total: response.model.total,
            }));
          }
          return response;
        })
      );
  }

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      filters: {
        ...state.filters,
        nameFilter: nameFilter,
      },
    }));
    this.checkOffset();
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
    this.checkOffset();
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  // getSort(): Observable<SortModel> {
  //   return this.query.selectSort$;
  // }

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  getNameFilter(): Observable<string> {
    return this.query.selectNameFilter$;
  }

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        offset: offset,
      },
    }));
  }

  onDelete() {
    this.store.update((state) => ({
      total: state.total - 1,
    }));
    this.checkOffset();
  }

  onSortTable(sort: string) {
    const localPageSetting = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        ...localPageSetting,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.total
    );
    if (newOffset !== this.query.pageSetting.pagination.offset) {
      this.store.update((state) => ({
        pagination: {
          ...state.pagination,
          offset: newOffset,
        },
      }));
    }
  }

  getPagination(): Observable<PaginationModel> {
    return this.query.selectPagination$;
  }
}
