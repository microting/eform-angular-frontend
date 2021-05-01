import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PlanningsStore, PlanningsState } from './plannings-store';

@Injectable({ providedIn: 'root' })
export class PlanningsQuery extends Query<PlanningsState> {
  constructor(protected store: PlanningsStore) {
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
  selectTagIds$ = this.select('tagIds');
  selectDescriptionFilter$ = this.select('descriptionFilter');
}
