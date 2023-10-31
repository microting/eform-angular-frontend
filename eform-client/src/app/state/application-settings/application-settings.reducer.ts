import {AdminSettingsModel, LanguagesModel, UserbackWidgetSettingModel} from 'src/app/common/models';
import {createReducer} from '@ngrx/store';

export interface AppSettingsState {
  adminSettingsModel: AdminSettingsModel;
  othersSettings: UserbackWidgetSettingModel;
  languagesModel: LanguagesModel;
}

export const initialState: AppSettingsState = {
  adminSettingsModel: new AdminSettingsModel(),
  othersSettings: {
    isUserbackWidgetEnabled: false,
    userbackToken: ''
  },
  languagesModel: new LanguagesModel(),
};

export const _appSettingsReducer = createReducer(
  initialState,
);

export function reducer(state: AppSettingsState | undefined, action: any) {
  return _appSettingsReducer(state, action);
}
