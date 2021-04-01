import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApplicationPagesSettings } from 'src/app/common/const/application-pages-settings.const';
import {
  ApplicationPageModel,
  OperationDataResult,
  OperationResult,
  PageSettingsModel,
} from 'src/app/common/models';
import { UserSettingsModel } from 'src/app/common/models/settings';
import { BaseService } from '../base.service';

export let UserSettingsMethods = {
  UserSettings: 'api/account/user-settings',
};

@Injectable()
export class UserSettingsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getUserSettings(): Observable<OperationDataResult<UserSettingsModel>> {
    return this.get(UserSettingsMethods.UserSettings);
  }

  getLocalPageSettings(
    localStorageItemName: string,
    pageName: string
  ): ApplicationPageModel {
    let localPagesSettings = localStorage.getItem(localStorageItemName);
    if (!localPagesSettings) {
      localStorage.setItem(
        localStorageItemName,
        JSON.stringify(ApplicationPagesSettings)
      );
      localPagesSettings = localStorage.getItem(localStorageItemName);
    }
    return <ApplicationPageModel>(
      JSON.parse(localPagesSettings).find((x) => x.groupName === pageName)
    );
  }

  updateLocalPageSettings(
    localStorageItemName: string,
    model: PageSettingsModel,
    pageName: string
  ) {
    const localPagesSettings = <Array<ApplicationPageModel>>(
      JSON.parse(localStorage.getItem(localStorageItemName))
    );
    localPagesSettings[
      localPagesSettings.findIndex((x) => x.name === pageName)
    ].settings = model;
    localStorage.setItem(
      localStorageItemName,
      JSON.stringify(localPagesSettings)
    );
  }

  updateUserSettings(model: UserSettingsModel): Observable<OperationResult> {
    return this.post<UserSettingsModel>(
      UserSettingsMethods.UserSettings,
      model
    );
  }
}
