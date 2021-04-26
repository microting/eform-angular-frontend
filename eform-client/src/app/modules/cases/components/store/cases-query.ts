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

  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
