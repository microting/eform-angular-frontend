import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AppSettingsStore, AppSettingsState } from './';

@Injectable({ providedIn: 'root' })
export class AppSettingsQuery extends Query<AppSettingsState> {
  constructor(protected store: AppSettingsStore) {
    super(store);
  }

  get pageSetting() {
    return this.getValue();
  }

  selectAllSettings$ = this.select((state) => {
    return {adminSettings: state.adminSettingsModel, othersSettings: state.othersSettings, languages: state.languagesModel};
  });
  selectAdminSettings$ = this.select((state) => state.adminSettingsModel);
  selectOthersSettings$ = this.select((state) => state.othersSettings);
}
