import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { CommonPaginationState } from 'src/app/common/models/common-pagination-state';

export interface InstallationsState {
  pagination: CommonPaginationState;
}

export function createInitialState(): InstallationsState {
  return <InstallationsState>{
    pagination: {
      pageSize: 10,
      sort: 'Id',
      isSortDsc: false,
      offset: 0,
    },
  };
}

export const installationsPersistStorage = persistState({
  include: ['trashInspectionPnInstallations'],
  key: 'pluginsStore',
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'trashInspectionPnInstallations', resettable: true })
export class InstallationsStore extends Store<InstallationsState> {
  constructor() {
    super(createInitialState());
  }
}

export const installationsPersistProvider = {
  provide: 'persistStorage',
  useValue: installationsPersistStorage,
  multi: true,
};
