import { Injectable } from '@angular/core';
import { UsersStore } from './users.store';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  Paged,
  UserInfoModel,
} from 'src/app/common/models';
import { UsersQuery } from 'src/app/modules/account-management/components/users/store/users.query';
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
  private total: number;

  getAllUsers(): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    return this.service
      .getAllUsers({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
      })
      .pipe(
        map((response) => {
          if (response && response.success && response.model) {
            this.total = response.model.total;
          }
          return response;
        })
      );
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  updatePageSize(pageSize: number) {
    const offset = getOffset(
      pageSize,
      this.query.pageSetting.pagination.offset,
      this.total
    );
    this.store.update((state) => ({
      pagination: { ...state.pagination, pageSize: pageSize, offset: offset },
    }));
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
    const offset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.total
    );
    if (this.query.pageSetting.pagination.offset !== offset) {
      this.store.update((state) => ({
        pagination: { ...state.pagination, offset: offset },
      }));
    }
  }
}
