import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';
import { FiltrationStateModel } from 'src/app/common/models';

export interface EntitySearchState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): EntitySearchState {
  return <EntitySearchState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
  };
}

const entitySearchPersistStorage = persistState({
  include: ['entitySearch'],
  key: 'mainStoreEntitySearch',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
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
