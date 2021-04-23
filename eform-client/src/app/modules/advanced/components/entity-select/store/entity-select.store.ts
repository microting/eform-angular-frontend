import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface EntitySelectState {
  pagination: CommonPaginationState;
}

export function createInitialState(): EntitySelectState {
  return <EntitySelectState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

export const entitySelectPersistStorage = persistState({
  include: ['entitySelect'],
  key: 'mainStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entitySelect', resettable: true })
export class EntitySelectStore extends Store<EntitySelectState> {
  constructor() {
    super(createInitialState());
  }
}

export const entitySelectPersistProvider = {
  provide: 'persistStorage',
  useValue: entitySelectPersistStorage,
  multi: true,
};
