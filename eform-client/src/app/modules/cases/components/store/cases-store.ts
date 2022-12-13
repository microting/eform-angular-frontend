import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  FiltrationStateModel,
  CommonPaginationState,
} from 'src/app/common/models';

export interface CasesState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

const casesPersistStorage = persistState({
  include: ['cases'],
  key: 'mainStoreCases',
  preStorageUpdate(storeName: string, state: CasesState): any {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

export function createInitialState(): CasesState {
  return <CasesState>{
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

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cases', resettable: true })
export class CasesStore extends Store<CasesState> {
  constructor() {
    super(createInitialState());
  }
}

export const casesPersistProvider = {
  provide: 'persistStorage',
  useValue: casesPersistStorage,
  multi: true,
};
