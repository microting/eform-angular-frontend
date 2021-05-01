import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { InstallationsState, InstallationsStore } from './installations-store';

@Injectable({ providedIn: 'root' })
export class InstallationsQuery extends Query<InstallationsState> {
  constructor(protected store: InstallationsStore) {
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
