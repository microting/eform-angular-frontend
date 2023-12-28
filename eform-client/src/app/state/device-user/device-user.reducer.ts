import {updateDeviceUserFilters} from './';
import {createReducer, on} from '@ngrx/store';

export interface DeviceUsersFilters {
  nameFilter: string
}

export interface DeviceUsersState {
  filters: DeviceUsersFilters;
}

export const deviceUsersInitialState: DeviceUsersState = {
  filters: {
    nameFilter: '',
  },
}

const _deviceUsersReducer = createReducer(
  deviceUsersInitialState,
  on(updateDeviceUserFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.nameFilter,
    },
  })),
);

export function deviceUsersReducer(state: DeviceUsersState | undefined, action: any) {
  return _deviceUsersReducer(state, action);
}
