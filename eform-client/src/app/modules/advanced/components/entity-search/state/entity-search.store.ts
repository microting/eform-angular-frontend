import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface EntitySearchState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  pageIndex: number;
}

export function createInitialState(): EntitySearchState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    pageIndex: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entitySearch' })
export class EntitySearchStore extends Store<EntitySearchState> {
  constructor() {
    super(createInitialState());
  }
}
