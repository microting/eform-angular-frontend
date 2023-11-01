import {createSelector} from '@ngrx/store';
import {DeviceUsersState} from 'src/app/state/device-user/device-user.reducer';

export const selectDeviceUsersState = (state) => state.deviceUsers;
export const selectDeviceUsersFilters =
  createSelector(selectDeviceUsersState, (state: DeviceUsersState) => state.filters);

export const selectDeviceUsersNameFilter =
  createSelector(selectDeviceUsersState, (state: DeviceUsersState) => state.filters.nameFilter);
