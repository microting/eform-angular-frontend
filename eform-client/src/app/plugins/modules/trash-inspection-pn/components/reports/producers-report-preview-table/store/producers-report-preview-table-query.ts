import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  ProducersReportPreviewTableState,
  ProducersReportPreviewTableStore,
} from './producers-report-preview-table-store';

@Injectable({ providedIn: 'root' })
export class ProducersReportPreviewTableQuery extends Query<ProducersReportPreviewTableState> {
  constructor(protected store: ProducersReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
}
