import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface EmailRecipientsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): EmailRecipientsState {
  return <EmailRecipientsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      tagIds: [],
    },
    total: 0,
  };
}

const emailRecipientsPersistStorage = persistState({
  include: ['emailRecipients'],
  key: 'mainStoreEmailRecipients',
  preStorageUpdate(storeName, state: EmailRecipientsState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
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
