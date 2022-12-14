import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface UsersState {
  pagination: CommonPaginationState;
  totalUsers: number;
}

export function createInitialState(): UsersState {
  return <UsersState>{
    pagination: {
      sort: 'Id',
      isSortDsc: false,
      pageSize: 10,
      offset: 0,
    },
    totalUsers: 0,
  };
}

const usersPersistStorage = persistState({
  include: ['users'],
  key: 'mainStoreUsers',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      // filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users', resettable: true })
export class UsersStore extends Store<UsersState> {
  constructor() {
    super(createInitialState());
  }
}

export const usersPersistProvider = {
  provide: 'persistStorage',
  useValue: usersPersistStorage,
  multi: true,
};
