import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface EmailRecipientsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): EmailRecipientsState {
  return <EmailRecipientsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      tagIds: [],
      offset: 0,
    },
  };
}

export const emailRecipientsPersistStorage = persistState({
  include: ['emailRecipients'],
  key: 'mainStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'emailRecipients', resettable: true })
export class EmailRecipientsStore extends Store<EmailRecipientsState> {
  constructor() {
    super(createInitialState());
  }
}

export const emailRecipientsPersistProvider = {
  provide: 'persistStorage',
  useValue: emailRecipientsPersistStorage,
  multi: true,
};
