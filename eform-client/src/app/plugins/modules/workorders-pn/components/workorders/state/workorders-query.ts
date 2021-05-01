import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { WorkordersStore, WorkordersState } from './workorders-store';

@Injectable({ providedIn: 'root' })
export class WorkordersQuery extends Query<WorkordersState> {
  constructor(protected store: WorkordersStore) {
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
