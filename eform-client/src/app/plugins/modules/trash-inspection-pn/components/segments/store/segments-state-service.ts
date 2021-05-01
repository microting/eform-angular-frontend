import { Injectable } from '@angular/core';
import { SegmentsStore } from './segments-store';
import { Observable } from 'rxjs';
import { OperationDataResult } from 'src/app/common/models';
import { updateTableSort } from 'src/app/common/helpers';
import { getOffset } from 'src/app/common/helpers/pagination.helper';
import { map } from 'rxjs/operators';
import { SegmentsQuery } from './segments-query';
import { SegmentsPnModel } from '../../../models';
import { TrashInspectionPnSegmentsService } from '../../../services';

@Injectable({ providedIn: 'root' })
export class SegmentsStateService {
  constructor(
    private store: SegmentsStore,
    private service: TrashInspectionPnSegmentsService,
    private query: SegmentsQuery
  ) {}

  private total: number;

  getAllSegments(): Observable<OperationDataResult<SegmentsPnModel>> {
    return this.service
      .getAllSegments({
        isSortDsc: this.query.pageSetting.pagination.isSortDsc,
        offset: this.query.pageSetting.pagination.offset,
        pageSize: this.query.pageSetting.pagination.pageSize,
        sort: this.query.pageSetting.pagination.sort,
        pageIndex: 0,
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

  updatePageSize(pageSize: number) {
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        pageSize: pageSize,
      },
    }));
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
    const localPageSettings = updateTableSort(
      sort,
      this.query.pageSetting.pagination.sort,
      this.query.pageSetting.pagination.isSortDsc
    );
    this.store.update((state) => ({
      pagination: {
        ...state.pagination,
        isSortDsc: localPageSettings.isSortDsc,
        sort: localPageSettings.sort,
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
