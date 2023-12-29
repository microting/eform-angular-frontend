import {AppState} from '../';

export const selectAppSettings = (state: AppState) => state.appSettings;

export const selectAllAppSettings = (state: AppState) => state.appSettings;
export const selectAdminSettings = (state: AppState) => state.appSettings.adminSettingsModel;
export const selectOthersSettings = (state: AppState) => state.appSettings.othersSettings;
export const selectLanguages = (state: AppState) => state.appSettings.languagesModel;
