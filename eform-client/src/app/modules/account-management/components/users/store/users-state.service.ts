import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  Paged,
  PaginationModel,
  UserInfoModel,
} from 'src/app/common/models';
import { UsersQuery, UsersStore } from './';
import { AdminService } from 'src/app/common/services';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  constructor(
    private store: UsersStore,
    private service: AdminService,
    private query: UsersQuery
  ) {}

  getAllUsers(): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    return this.service
      .getAllUsers({ ...this.query.pageSetting.pagination })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.store.update(() => ({
              totalUsers: response.model.total,
            }));
          }
          return response;
        })
      );
  }

  // getIsSortDsc(): Observable<boolean> {
  //   return this.query.selectIsSortDsc$;
  // }

  // getSort(): Observable<SortModel> {
  //   return this.query.selectSort$;
  // }

  getActiveSort(): Observable<string> {
    return this.query.selectActiveSort$;
  }

  getActiveSortDirection(): Observable<'asc' | 'desc'> {
    return this.query.selectActiveSortDirection$;
  }

  // getOffset(): Observable<number> {
  //   return this.query.selectOffset$;
  // }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
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

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: { ...state.pagination, sort: localPageSettings.sort },
    }));
  }

  changePage(offset: number) {
    this.store.update((state) => ({
      pagination: { ...state.pagination, offset: offset },
    }));
  }

  onDelete() {
    this.store.update((state) => ({
      totalUsers: state.totalUsers - 1,
    }));
    this.checkOffset();
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.query.pageSetting.totalUsers
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
