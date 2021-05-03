import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { SecurityStore, SecurityState } from './';
import { PaginationModel, SortModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class SecurityQuery extends Query<SecurityState> {
  constructor(protected store: SecurityStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectNameFilter$ = this.select((state) => state.filters.nameFilter);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectPagination$ = this.select(
    (state) =>
      new PaginationModel(
        state.total,
        state.pagination.pageSize,
        state.pagination.offset
      )
  );
  selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );
}
