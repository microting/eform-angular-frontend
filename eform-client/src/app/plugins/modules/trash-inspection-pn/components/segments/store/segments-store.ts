import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface SegmentsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): SegmentsState {
  return <SegmentsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
  };
}

const segmentsPersistStorage = persistState({
  include: ['trashInspectionPnSegments'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnSegments', resettable: true })
export class SegmentsStore extends Store<SegmentsState> {
  constructor() {
    super(createInitialState());
  }
}

export const segmentsPersistProvider = {
  provide: 'persistStorage',
  useValue: segmentsPersistStorage,
  multi: true,
};
