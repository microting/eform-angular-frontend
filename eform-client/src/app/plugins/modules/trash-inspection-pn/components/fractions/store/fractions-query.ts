import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { FractionsState, FractionsStore } from './fractions-store';

@Injectable({ providedIn: 'root' })
export class FractionsQuery extends Query<FractionsState> {
  constructor(protected store: FractionsStore) {
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
