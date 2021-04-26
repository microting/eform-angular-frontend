import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface EntitySearchState {
  pagination: CommonPaginationState;
}

export function createInitialState(): EntitySearchState {
  return <EntitySearchState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      pageIndex: 0,
    },
  };
}

export const entitySearchPersistStorage = persistState({
  include: ['entitySearch'],
  key: 'mainStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'entitySearch', resettable: true })
export class EntitySearchStore extends Store<EntitySearchState> {
  constructor() {
    super(createInitialState());
  }
}

export const entitySearchPersistProvider = {
  provide: 'persistStorage',
  useValue: entitySearchPersistStorage,
  multi: true,
};
