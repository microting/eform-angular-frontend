import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface EntitySelectState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
}

export function createInitialState(): EntitySelectState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entitySelect' })
export class EntitySelectStore extends Store<EntitySelectState> {
  constructor() {
    super(createInitialState());
  }
}
