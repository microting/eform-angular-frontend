import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface EntitySelectState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): EntitySelectState {
  return <EntitySelectState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
    filters: {
      nameFilter: '',
    },
    total: 0,
  };
}

const entitySelectPersistStorage = persistState({
  include: ['entitySelect'],
  key: 'mainStoreEntitySelect',
  preStorageUpdate(storeName: string, state: EntitySelectState): any {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
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
