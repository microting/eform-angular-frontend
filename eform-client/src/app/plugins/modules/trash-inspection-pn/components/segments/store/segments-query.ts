import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SegmentsState, SegmentsStore } from './segments-store';

@Injectable({ providedIn: 'root' })
export class SegmentsQuery extends Query<SegmentsState> {
  constructor(protected store: SegmentsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
