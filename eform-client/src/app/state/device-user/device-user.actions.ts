import {createAction} from '@ngrx/store';
import {DeviceUsersFilters} from 'src/app/state';

export const loadDeviceUsers = createAction(
  '[DeviceUser] Load DeviceUsers'
);

export const updateDeviceUserFilters = createAction(
  '[DeviceUser] Update DeviceUser Filters',
  (payload: DeviceUsersFilters) => ({payload})
);
