import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface SecurityState {
  pagination: CommonPaginationState;
}

export function createInitialState(): SecurityState {
  return <SecurityState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

export const securityPersistStorage = persistState({
  include: ['security'],
  key: 'mainStore',
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
