import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EmailRecipientsStore, EmailRecipientsState } from './';
import { PaginationModel } from 'src/app/common/models';

@Injectable({ providedIn: 'root' })
export class EmailRecipientsQuery extends Query<EmailRecipientsState> {
  constructor(protected store: EmailRecipientsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectTagIds$ = this.select((state) => state.filters.tagIds);
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
  /*selectSort$ = this.select(
    (state) => new SortModel(state.pagination.sort, state.pagination.isSortDsc)
  );*/
  selectActiveSort$ = this.select((state) => state.pagination.sort);
  selectActiveSortDirection$ = this.select((state) => state.pagination.isSortDsc ? 'desc' : 'asc');
}
