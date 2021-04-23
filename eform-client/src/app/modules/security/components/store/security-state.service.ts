import { Injectable } from '@angular/core';
import { SecurityStore } from './security.store';
import { SecurityGroupsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import { SecurityQuery } from 'src/app/modules/security/components/store/security.query';
import {
  OperationDataResult,
  Paged,
  SecurityGroupModel,
} from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SecurityStateService {
  constructor(
    private store: SecurityStore,
    private service: SecurityGroupsService,
    private query: SecurityQuery
  ) {}

  private total: number;

  getAllSecurityGroups(): Observable<
    OperationDataResult<Paged<SecurityGroupModel>>
  > {
    return this.service
      .getAllSecurityGroups({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        nameFilter: this.query.pageSetting.pagination.nameFilter,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        pageIndex: 0,
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

  updateNameFilter(nameFilter: string) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        nameFilter: nameFilter,
      },
    }));
  }

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
  }

  getOffset(): Observable<number> {
    return this.query.selectOffset$;
  }

  getPageSize(): Observable<number> {
    return this.query.selectPageSize$;
  }

  getSort(): Observable<string> {
    return this.query.selectSort$;
  }

  getIsSortDsc(): Observable<boolean> {
    return this.query.selectIsSortDsc$;
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
    this.total -= 1;
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
        isSortDsc: localPageSetting.isSortDsc,
        sort: localPageSetting.sort,
      },
    }));
  }

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pagination.pageSize,
      this.query.pageSetting.pagination.offset,
      this.total
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
}
