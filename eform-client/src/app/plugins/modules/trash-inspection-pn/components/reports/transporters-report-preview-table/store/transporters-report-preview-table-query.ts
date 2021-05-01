import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  TransportersReportPreviewTableState,
  TransportersReportPreviewTableStore,
} from './transporters-report-preview-table-store';

@Injectable({ providedIn: 'root' })
export class TransportersReportPreviewTableQuery extends Query<TransportersReportPreviewTableState> {
  constructor(protected store: TransportersReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
}
