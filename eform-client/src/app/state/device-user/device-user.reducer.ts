import {FiltrationStateModel} from 'src/app/common/models';
import {updateDeviceUserFilters} from 'src/app/state/device-user/device-user.actions';
import {createReducer, on} from '@ngrx/store';

export interface DeviceUsersState {
  filters: FiltrationStateModel;
}

export const initialState: DeviceUsersState = {
  filters: {
    tagIds: [],
    nameFilter: '',
  },
}

export const _deviceUsersReducer = createReducer(
  initialState,
  on(updateDeviceUserFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    },
  })),
);

export function reducer(state: DeviceUsersState | undefined, action: any) {
  return _deviceUsersReducer(state, action);
}
