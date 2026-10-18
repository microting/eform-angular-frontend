import {createAction} from '@ngrx/store';
import {AdminSettingsModel, LanguagesModel} from 'src/app/common/models';

export const updateAdminSettings = createAction(
  '[AppSettings] Update AdminSettings',
  (payload: AdminSettingsModel) => ({payload})
);

export const resetLoginPageSettings = createAction(
  '[AppSettings] Reset login page settings'
);

export const resetHeaderSettings = createAction(
  '[AppSettings] Reset header settings'
);

export const updateLanguages = createAction(
  '[AppSettings] Update Languages',
  (payload: LanguagesModel) => ({payload})
);
