import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';
import { entitySelectPersistStorage } from 'src/app/modules/advanced/components/entity-select/store/entity-select.store';

export interface CasePostsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): CasePostsState {
  return <CasePostsState>{
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

export const casePostsPersistStorage = persistState({
  include: ['casePosts'],
  key: 'mainStore',
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
