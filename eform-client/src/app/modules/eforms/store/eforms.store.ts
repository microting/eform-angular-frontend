import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface EformsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
}

export function createInitialState(): EformsState {
  return <EformsState>{
    pagination: {
      sort: 'Id',
      isSortDsc: false,
    },
    filters: {
      nameFilter: '',
      tagIds: [],
    },
  };
}

const eformsPersistStorage = persistState({
  include: ['eforms'],
  key: 'mainStoreEforms',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'eforms', resettable: true })
export class EformsStore extends Store<EformsState> {
  constructor() {
    super(createInitialState());
  }
}

export const persistProvider = {
  provide: 'persistStorage',
  useValue: eformsPersistStorage,
  multi: true,
};
