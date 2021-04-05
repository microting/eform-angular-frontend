import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { CasePostsStore, CasePostsState } from './case-posts-store';

@Injectable({ providedIn: 'root' })
export class CasePostsQuery extends Query<CasePostsState> {
  constructor(protected store: CasePostsStore) {
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
