import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import { UserSettingsModel } from 'src/app/common/models/settings';
import { ApiBaseService } from 'src/app/common/services';

export let UserSettingsMethods = {
  UserSettings: 'api/account/user-settings',
};

@Injectable()
export class UserSettingsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getUserSettings(): Observable<OperationDataResult<UserSettingsModel>> {
    return this.apiBaseService.get(UserSettingsMethods.UserSettings);
  }

  updateUserSettings(model: UserSettingsModel): Observable<OperationResult> {
    return this.apiBaseService.post<UserSettingsModel>(
      UserSettingsMethods.UserSettings,
      model
    );
  }
}
