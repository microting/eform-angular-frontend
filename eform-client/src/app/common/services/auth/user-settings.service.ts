import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
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

  updateUserSettings(model: UserSettingsModel): Observable<OperationResult> {
    return this.post<UserSettingsModel>(
      UserSettingsMethods.UserSettings,
      model
    );
  }
}
