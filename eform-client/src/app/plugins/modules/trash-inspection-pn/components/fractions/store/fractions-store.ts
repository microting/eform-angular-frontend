import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface FractionsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): FractionsState {
  return <FractionsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
  };
}

export const fractionsPersistStorage = persistState({
  include: ['trashInspectionPnFractions'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnFractions', resettable: true })
export class FractionsStore extends Store<FractionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const fractionsPersistProvider = {
  provide: 'persistStorage',
  useValue: fractionsPersistStorage,
  multi: true,
};
