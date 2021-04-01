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

  selectPageSize$ = this.select('pageSize');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
}
