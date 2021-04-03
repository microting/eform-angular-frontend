import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UsersState {
  sort: string;
  isSortDsc: boolean;
  offset: number;
  pageSize: number;
}

export function createInitialState(): UsersState {
  return {
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    pageSize: 10,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class UsersStore extends Store<UsersState> {
  constructor() {
    super(createInitialState());
  }
}
