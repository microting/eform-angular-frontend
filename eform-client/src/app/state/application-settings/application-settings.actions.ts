import {createAction} from '@ngrx/store';

export const updateAdminSettings = createAction(
  '[AppSettings] Update AdminSettings',
  (payload: any) => ({payload})
);

export const updateOthersSettings = createAction(
  '[AppSettings] Update Others Settings',
  (payload: any) => ({payload})
);

export const updateLanguages = createAction(
  '[AppSettings] Update Languages',
  (payload: any) => ({payload})
);

export const updateUserbackWidgetSetting = createAction(
  '[AppSettings] Update Userback Widget Setting',
  (payload: any) => ({payload})
);
