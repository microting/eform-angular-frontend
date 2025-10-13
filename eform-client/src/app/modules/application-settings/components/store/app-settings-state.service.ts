import { Injectable, inject } from '@angular/core';
import {AppSettingsService} from 'src/app/common/services';
import {AdminSettingsModel, LanguagesModel} from 'src/app/common/models';
import {take, zip, tap} from 'rxjs';
import {Store} from '@ngrx/store';
import {
  updateAdminSettings,
  updateOthersSettings,
  updateLanguages, updateUserbackWidgetSetting
} from 'src/app/state';

@Injectable({providedIn: 'root'})
export class AppSettingsStateService {
  private service = inject(AppSettingsService);
  private authStore = inject(Store);


  getAdminSettings() {
    return this.service.getAdminSettings().pipe(take(1));
  }

  getOtherSettings() {
    return this.service.getUserbackWidgetIsEnabled().pipe(take(1));
  }

  getAllAppSettings() {
    zip(
      this.getAdminSettings(),
      this.getOtherSettings(),
      this.getLanguages()
    ).pipe(tap(([adminSettings, otherSettings, languages]) => {
      if (adminSettings && adminSettings.success && adminSettings.model) {
        this.authStore.dispatch(updateAdminSettings(adminSettings.model));
      }
      if (otherSettings && otherSettings.success && otherSettings.model) {
        this.authStore.dispatch(updateOthersSettings(otherSettings.model));
      }
      if (languages && languages.success && languages.model) {
        this.authStore.dispatch(updateLanguages(languages.model));
      }
    })).subscribe();
  }

  updateAdminSettings(adminSettings: AdminSettingsModel) {
    return this.service.updateAdminSettings(adminSettings)
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.authStore.dispatch(updateAdminSettings(adminSettings));
          }
        })
      );
  }

  updateUserbackWidgetIsEnabled(UserbackWidgetIsEnabled: boolean) {
    return this.service.updateUserbackWidgetIsEnabled(UserbackWidgetIsEnabled)
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.authStore.dispatch(updateUserbackWidgetSetting({isUserbackWidgetEnabled: UserbackWidgetIsEnabled}));
          }
        })
      );
  }

  getLanguages() {
    return this.service.getLanguages();
  }

  updateLanguages(languages: LanguagesModel) {
    return this.service.updateLanguages(languages);
  }
}
