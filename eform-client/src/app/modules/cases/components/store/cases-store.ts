import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface CasesState {
  pagination: CommonPaginationState;
}

export const casesPersistStorage = persistState({
  include: ['cases'],
  key: 'mainStore',
});

export function createInitialState(): CasesState {
  return <CasesState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
      pageIndex: 0,
    },
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
