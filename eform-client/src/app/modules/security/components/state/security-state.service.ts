import { Injectable } from '@angular/core';
import { SecurityStore } from './security.store';
import { SecurityGroupsService } from 'src/app/common/services';
import { Observable } from 'rxjs';
import { SecurityQuery } from 'src/app/modules/security/components/state/security.query';
import {
  OperationDataResult,
  Paged,
  SecurityGroupModel,
} from 'src/app/common/models';
import { updateTablePage, updateTableSort } from 'src/app/common/helpers';
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
        isSortDsc: this.query.pageSetting.isSortDsc,
        nameFilter: this.query.pageSetting.nameFilter,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        pageIndex: 0,
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

  updateNameFilter(nameFilter: string) {
    this.store.update({ nameFilter: nameFilter });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
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
    const updatedPageSetting = updateTablePage(offset, {
      offset: this.query.pageSetting.offset,
      pageSize: this.query.pageSetting.pageSize,
      isSortDsc: false,
      sort: '',
      pageIndex: 0,
    });
    this.store.update({ offset: updatedPageSetting.offset });
  }

  onDelete() {
    this.total -= 1;
    this.checkOffset();
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

  checkOffset() {
    const newOffset = getOffset(
      this.query.pageSetting.pageSize,
      this.query.pageSetting.offset,
      this.total
    );
    if (newOffset !== this.query.pageSetting.offset) {
      this.store.update({ offset: newOffset });
    }
  }
}
