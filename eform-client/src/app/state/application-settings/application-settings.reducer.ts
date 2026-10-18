import {
  AdminSettingsModel,
  HeaderSettingsModel,
  LanguagesModel,
  LoginPageSettingsModel
} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  resetHeaderSettings,
  resetLoginPageSettings,
  updateAdminSettings,
  updateLanguages
} from './';

export interface AppSettingsState {
  adminSettingsModel: AdminSettingsModel;
  languagesModel: LanguagesModel;
}

export const appSettingsInitialState: AppSettingsState = {
  adminSettingsModel: new AdminSettingsModel(),
  languagesModel: new LanguagesModel(),
};

const _appSettingsReducer = createReducer(
  appSettingsInitialState,
  on(updateAdminSettings, (state, {payload}) => ({
      ...state,
      adminSettingsModel: payload,
    })
  ),
  on(resetLoginPageSettings, (state) => ({
      ...state,
      adminSettingsModel: {
        ...state.adminSettingsModel,
        loginPageSettings: new LoginPageSettingsModel(),
      },
    })
  ),
  on(resetHeaderSettings, (state) => ({
      ...state,
      adminSettingsModel: {
        ...state.adminSettingsModel,
        headerSettings: new HeaderSettingsModel(),
      },
    })
  ),
  on(updateLanguages, (state, {payload}) => ({
      ...state,
      languagesModel: payload,
    })
  ),
);

export function appSettingsReducer(state: AppSettingsState | undefined, action: any) {
  return _appSettingsReducer(state, action);
}
