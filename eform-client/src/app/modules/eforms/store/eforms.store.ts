import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface EformsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): EformsState {
  return <EformsState>{
    pagination: {
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      tagIds: [],
    },
  };
}

export const eformsPersistStorage = persistState({
  include: ['eforms'],
  key: 'mainStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'eforms', resettable: true })
export class EformsStore extends Store<EformsState> {
  constructor() {
    super(createInitialState());
  }
}

export const persistProviders = [
  { provide: 'persistStorage', useValue: eformsPersistStorage, multi: true },
];
