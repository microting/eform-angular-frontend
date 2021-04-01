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
    return this.getValue().offset;
  }

  selectPageSize$ = this.select('pageSize');
  selectIsSortDsc$ = this.select('isSortDsc');
  selectSort$ = this.select('sort');
  selectOffset$ = this.select('offset');
  selectTagsIds$ = this.select('tagsIds');
}
