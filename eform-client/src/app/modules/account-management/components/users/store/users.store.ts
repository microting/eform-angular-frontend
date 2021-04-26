import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface UsersState {
  pagination: CommonPaginationState;
}

export function createInitialState(): UsersState {
  return <UsersState>{
    pagination: {
      sort: 'Id',
      isSortDsc: false,
      pageSize: 10,
      offset: 0,
    },
  };
}

export const usersPersistStorage = persistState({
  include: ['users'],
  key: 'mainStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users', resettable: true })
export class UsersStore extends Store<UsersState> {
  constructor() {
    super(createInitialState());
  }
}

export const usersPersistProviders = [
  { provide: 'persistStorage', useValue: usersPersistStorage, multi: true },
];
