import { Injectable } from '@angular/core';
import { DashboardsStore } from './dashboards-store.service';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { DashboardsQuery } from './dashboards-query';
import { InsightDashboardPnDashboardsService } from 'src/app/plugins/modules/insight-dashboard-pn/services';
import { DashboardsListModel } from 'src/app/plugins/modules/insight-dashboard-pn/models';

@Injectable({ providedIn: 'root' })
export class DashboardsStateService {
  constructor(
    private store: DashboardsStore,
    private service: InsightDashboardPnDashboardsService,
    private query: DashboardsQuery
  ) {}

  private total: number;

  getAll(): Observable<OperationDataResult<DashboardsListModel>> {
    return this.service
      .getAll({
        isSortDsc: this.query.pageSetting.isSortDsc,
        offset: this.query.pageSetting.offset,
        pageSize: this.query.pageSetting.pageSize,
        sort: this.query.pageSetting.sort,
        searchString: this.query.pageSetting.nameFilter,
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
    this.store.update({ nameFilter: nameFilter, offset: 0 });
  }

  updatePageSize(pageSize: number) {
    this.store.update({ pageSize: pageSize });
    this.checkOffset();
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
    this.store.update({
      offset: offset,
    });
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
      this.store.update({
        offset: newOffset,
      });
    }
  }
}
