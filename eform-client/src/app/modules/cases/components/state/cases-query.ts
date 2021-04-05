import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CasesStore, CasesState } from './cases-store';

@Injectable({ providedIn: 'root' })
export class CasesQuery extends Query<CasesState> {
  constructor(protected store: CasesStore) {
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
