import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface TrashInspectionsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): TrashInspectionsState {
  return <TrashInspectionsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      nameFilter: '',
      offset: 0,
    },
  };
}

const trashInspectionPersistStorage = persistState({
  include: ['trashInspectionPnTrashInspections'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnTrashInspections', resettable: true })
export class TrashInspectionsStore extends Store<TrashInspectionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const trashInspectionPersistProvider = {
  provide: 'persistStorage',
  useValue: trashInspectionPersistStorage,
  multi: true,
};
