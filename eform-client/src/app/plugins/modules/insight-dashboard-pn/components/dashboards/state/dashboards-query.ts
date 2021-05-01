import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DashboardsStore, DashboardsState } from './dashboards-store.service';

@Injectable({ providedIn: 'root' })
export class DashboardsQuery extends Query<DashboardsState> {
  constructor(protected store: DashboardsStore) {
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
