import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {EformsState, EformsStore} from './eforms.store';

@Injectable({ providedIn: 'root' })
export class EformsQuery extends Query<EformsState> {
  constructor(protected store: EformsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select((state) => state.pagination.nameFilter);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectTagIds$ = this.select((state) => state.pagination.tagIds);
}
