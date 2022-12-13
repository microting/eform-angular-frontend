import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import { FiltrationStateModel } from 'src/app/common/models';

export interface DeviceUsersState {
  filters: FiltrationStateModel;
}

export function createInitialState(): DeviceUsersState {
  return <DeviceUsersState>{
    filters: {
      nameFilter: '',
    },
  };
}

const deviceUsersPersistStorage = persistState({
  include: ['deviceUsers'],
  key: 'mainStoreDeviceUsers',
  preStorageUpdate(storeName, state) {
    return {
      filters: state.filters,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'deviceUsers', resettable: true })
export class DeviceUsersStore extends Store<DeviceUsersState> {
  constructor() {
    super(createInitialState());
  }
}

export const DeviceUsersPersistProvider = {
  provide: 'persistStorage',
  useValue: deviceUsersPersistStorage,
  multi: true,
};
