import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  FractionsReportPreviewTableState,
  FractionsReportPreviewTableStore,
} from './fractions-report-preview-table-store';

@Injectable({ providedIn: 'root' })
export class FractionsReportPreviewTableQuery extends Query<FractionsReportPreviewTableState> {
  constructor(protected store: FractionsReportPreviewTableStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
}
