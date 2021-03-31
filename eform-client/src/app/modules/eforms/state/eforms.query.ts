import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EformsStore, EformsState } from './eforms.store';

@Injectable({ providedIn: 'root' })
export class EformsQuery extends Query<EformsState> {
  constructor(protected store: EformsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select('nameFilter');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectTagIds$ = this.select('tagIds');
}
