import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface EmailRecipientsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  tagsIds: number[];
  offset: number;
}

export function createInitialState(): EmailRecipientsState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    tagsIds: [],
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'emailRecipients' })
export class EmailRecipientsStore extends Store<EmailRecipientsState> {
  constructor() {
    super(createInitialState());
  }
}
