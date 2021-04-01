import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EntitySelectStore, EntitySelectState } from './entity-select.store';

@Injectable({ providedIn: 'root' })
export class EntitySelectQuery extends Query<EntitySelectState> {
  constructor(protected store: EntitySelectStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select('pageSize');
  selectOffset$ = this.select('offset');
  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
}
