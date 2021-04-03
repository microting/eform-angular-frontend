import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface CasePostsState {
  pageSize: number;
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  offset: number;
  pageIndex: number;
}

export function createInitialState(): CasePostsState {
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
@StoreConfig({ name: 'casePosts' })
export class CasePostsStore extends Store<CasePostsState> {
  constructor() {
    super(createInitialState());
  }
}
