import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {
  EmailRecipientsStore,
  EmailRecipientsState,
} from './email-recipients.store';

@Injectable({ providedIn: 'root' })
export class EmailRecipientsQuery extends Query<EmailRecipientsState> {
  constructor(protected store: EmailRecipientsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  get offset() {
    return this.getValue().pagination.offset;
  }

  selectTagsIds$ = this.select((state) => state.pagination.tagIds);
  selectPageSize$ = this.select((state) => state.pagination.pageSize);
  selectIsSortDsc$ = this.select((state) => state.pagination.isSortDsc);
  selectSort$ = this.select((state) => state.pagination.sort);
  selectOffset$ = this.select((state) => state.pagination.offset);
}
