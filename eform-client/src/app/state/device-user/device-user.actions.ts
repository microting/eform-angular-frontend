import {createAction} from '@ngrx/store';

export const loadDeviceUsers = createAction(
  '[DeviceUser] Load DeviceUsers'
);

export const updateDeviceUserFilters = createAction(
  '[DeviceUser] Update DeviceUser Filters',
  (payload: any) => ({payload})
);
