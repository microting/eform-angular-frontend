import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface SecurityState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): SecurityState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'security' })
export class SecurityStore extends Store<SecurityState> {
  constructor() {
    super(createInitialState());
  }
}
