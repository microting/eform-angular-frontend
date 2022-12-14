import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface SecurityState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): SecurityState {
  return <SecurityState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
    total: 0,
  };
}

const securityPersistStorage = persistState({
  include: ['security'],
  key: 'mainStoreSecurity',
  preStorageUpdate(storeName, state: SecurityState) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'security', resettable: true })
export class SecurityStore extends Store<SecurityState> {
  constructor() {
    super(createInitialState());
  }
}

export const securityPersistProvider = {
  provide: 'persistStorage',
  useValue: securityPersistStorage,
  multi: true,
};
