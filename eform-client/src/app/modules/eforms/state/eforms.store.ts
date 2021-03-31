import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface EformsState {
  sort: string;
  isSortDsc: boolean;
  nameFilter: string;
  tagIds: number[];
}

export function createInitialState(): EformsState {
  return {
    sort: 'Id',
    isSortDsc: false,
    nameFilter: '',
    tagIds: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Eforms' })
export class EformsStore extends Store<EformsState> {
  constructor() {
    super(createInitialState());
  }
}
