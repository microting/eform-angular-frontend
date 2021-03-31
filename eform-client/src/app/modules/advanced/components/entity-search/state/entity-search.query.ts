import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EntitySearchStore, EntitySearchState } from './entity-search.store';

@Injectable({ providedIn: 'root' })
export class EntitySearchQuery extends Query<EntitySearchState> {
  constructor(protected store: EntitySearchStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  get pageOffset() {
    return this.getValue().pageSize * this.getValue().pageIndex;
  }

  selectPageSize$ = this.select('pageSize');
  selectPageIndex$ = this.select('pageIndex');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
}
