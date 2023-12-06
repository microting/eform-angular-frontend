import {Injectable} from '@angular/core';
import {AppSettingsService} from 'src/app/common/services';
import {map} from 'rxjs/operators';
import {AdminSettingsModel, LanguagesModel} from 'src/app/common/models';
import {take} from 'rxjs';
import { Store } from '@ngrx/store';
import {selectAuthIsAuth} from 'src/app/state/auth/auth.selector';

@Injectable({providedIn: 'root'})
export class AppSettingsStateService {
  public selectIsAuth$ = this.authStore.select(selectAuthIsAuth);
  constructor(
    //private store: AppSettingsStore,
    private service: AppSettingsService,
    //private query: AppSettingsQuery,
    private authStore: Store
  ) {
    // this.selectIsAuth$.subscribe((isAuth) => {
    //   if (isAuth) {
    //     this.getAllAppSettings();
    //   }
    // });
    //this.getAllAppSettings();
  }

  getAdminSettings() {
    return this.service.getAdminSettings().pipe(take(1));
  }

  getOtherSettings() {
    return this.service.getUserbackWidgetIsEnabled().pipe(take(1));
  }

  getAllAppSettings() {
    this.getAdminSettings().subscribe((response) => {
      if (response && response.success && response.model) {
        //debugger;
        this.authStore.dispatch({type: '[AppSettings] Update AdminSettings', payload: response.model});
        // this.store.update(() => ({
        //   adminSettingsModel: response.model,
        // }));
      }
      return response;
    });
    this.getOtherSettings().subscribe((response) => {
      if (response && response.success && response.model) {
        this.authStore.dispatch({type: '[AppSettings] Update OthersSettings', payload: response.model});
        // this.store.update((state) => ({
        //   othersSettings: {...state.othersSettings, ...response.model},
        // }));
      }
    });
    this.getLanguages().subscribe((response) => {
      if (response && response.success && response.model) {
        this.authStore.dispatch({type: '[AppSettings] Update Languages', payload: response.model});
        // this.store.update(() => ({
        //   languagesModel: response.model,
        // }));
      }
    });
  }

  updateAdminSettings(adminSettings: AdminSettingsModel) {
    return this.service.updateAdminSettings(adminSettings)
      .pipe(
        map((response) => {
          if (response && response.success) {
            this.authStore.dispatch({type: '[AppSettings] Update AdminSettings', payload: adminSettings});
            // this.store.update(() => ({
            //   adminSettingsModel: adminSettings,
            // }));
          }
          return response;
        })
      );
  }

  updateUserbackWidgetIsEnabled(UserbackWidgetIsEnabled: boolean) {
    return this.service.updateUserbackWidgetIsEnabled(UserbackWidgetIsEnabled)
      .pipe(
        map((response) => {
          if (response && response.success) {
            this.authStore.dispatch({type: '[AppSettings] Update Userback Widget Setting', payload: {isUserbackWidgetEnabled: UserbackWidgetIsEnabled}});
            // this.store.update((state) => ({
            //   othersSettings: {...state.othersSettings, isUserbackWidgetEnabled: UserbackWidgetIsEnabled},
            // }));
          }
          return response;
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
