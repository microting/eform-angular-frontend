import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  CommonPaginationState,
  FiltrationStateModel,
} from 'src/app/common/models';

export interface CasePostsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export function createInitialState(): CasePostsState {
  return <CasePostsState>{
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

const casePostsPersistStorage = persistState({
  include: ['casePosts'],
  key: 'mainStoreCasePosts',
  preStorageUpdate(storeName, state) {
    return {
      pagination: state.pagination,
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'casePosts', resettable: true })
export class CasePostsStore extends Store<CasePostsState> {
  constructor() {
    super(createInitialState());
  }
}

export const casePostsPersistProvider = {
  provide: 'persistStorage',
  useValue: casePostsPersistStorage,
  multi: true,
};
