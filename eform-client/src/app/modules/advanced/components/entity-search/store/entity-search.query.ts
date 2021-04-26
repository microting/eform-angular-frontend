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
    return (
      this.getValue().pagination.pageSize * this.getValue().pagination.pageIndex
    );
  }

  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
}
