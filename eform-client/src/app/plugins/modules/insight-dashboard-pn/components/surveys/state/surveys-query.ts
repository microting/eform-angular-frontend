import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SurveysStore, SurveysState } from './surveys-store.service';

@Injectable({ providedIn: 'root' })
export class SurveysQuery extends Query<SurveysState> {
  constructor(protected store: SurveysStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
}
