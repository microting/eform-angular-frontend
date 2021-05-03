import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EformsState, EformsStore } from './';
import { SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class EformsQuery extends Query<EformsState> {
  constructor(protected store: EformsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectTagIds$ = this.select((state) => state.filters.tagIds);
  selectNameFilter$ = this.select((state) => state.filters.nameFilter);
  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
