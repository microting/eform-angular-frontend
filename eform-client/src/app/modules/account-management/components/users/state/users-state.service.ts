import { Injectable } from '@angular/core';
import { UsersStore } from './users.store';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  Paged,
  UserInfoModel,
} from 'src/app/common/models';
import { UsersQuery } from 'src/app/modules/account-management/components/users/state/users.query';
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
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
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
      this.query.pageSetting.offset,
      this.total
    );
    this.store.update({ pageSize: pageSize, offset: offset });
  }

  onSortTable(sort: string) {
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.sort,
      this.query.pageSetting.isSortDsc
    );
    this.store.update({
      isSortDsc: localPageSettings.isSortDsc,
      sort: localPageSettings.sort,
    });
  }

  changePage(offset: number) {
    this.store.update({ offset: offset });
  }

  onDelete() {
    const offset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      this.total
    );
    if (this.query.pageSetting.offset !== offset) {
      this.store.update({ offset: offset });
    }
  }
}
