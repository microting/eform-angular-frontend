import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SecurityStore, SecurityState } from './security.store';

@Injectable({ providedIn: 'root' })
export class SecurityQuery extends Query<SecurityState> {
  constructor(protected store: SecurityStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
