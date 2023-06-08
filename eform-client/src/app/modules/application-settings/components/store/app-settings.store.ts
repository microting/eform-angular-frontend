import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';
import {
  AdminSettingsModel, LanguagesModel, UserbackWidgetSettingModel,
} from 'src/app/common/models';

export interface AppSettingsState {
  adminSettingsModel: AdminSettingsModel;
  othersSettings: UserbackWidgetSettingModel;
  languagesModel: LanguagesModel;
}

export function createInitialState(): AppSettingsState {
  return <AppSettingsState>{
    adminSettingsModel: new AdminSettingsModel(),
    othersSettings: {
      isUserbackWidgetEnabled: false,
      userbackToken: ''
    },
  };
}

const appSettingsPersistStorage = persistState({
  include: ['appSettings'],
  key: 'mainStoreAppSettings',
  preStorageUpdate(storeName, state: AppSettingsState): AppSettingsState {
    return {
      adminSettingsModel: state.adminSettingsModel,
      othersSettings: state.othersSettings,
      languagesModel: state.languagesModel,
    };
  },
});

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'appSettings', resettable: true })
export class AppSettingsStore extends Store<AppSettingsState> {
  constructor() {
    super(createInitialState());
  }
}

export const appSettingsProvider = {
  provide: 'persistStorage',
  useValue: appSettingsPersistStorage,
  multi: true,
};
