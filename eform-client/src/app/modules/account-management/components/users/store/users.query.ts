import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UsersStore, UsersState } from './';
import { PaginationModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends Query<UsersState> {
  constructor(protected store: UsersStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  // selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  // selectSort$ = this.select((state) => state.pagination.sort);
  // selectOffset$ = this.select((state) => state.pagination.offset);

  selectPagination$ = this.select(
    (state) =>
      new PaginationModel(
        state.totalUsers,
        state.pagination.pageSize,
        state.pagination.offset
      )
  );
  /*selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );*/
  selectActiveSort$ = this.select((state) => state.pagination.sort);
  selectActiveSortDirection$ = this.select((state) => state.pagination.isSortDsc ? 'desc' : 'asc');
}
