import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface CasesState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
  pageIndex: number;
}

export function createInitialState(): CasesState {
  return {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    offset: 0,
    pageIndex: 0,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cases' })
export class CasesStore extends Store<CasesState> {
  constructor() {
    super(createInitialState());
  }
}
