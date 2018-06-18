import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UserSettingsModel} from 'app/models/settings';
import {OperationDataResult, OperationResult} from 'app/modules';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';

export let UserSettingsMethods = {
  UserSettings: 'api/account/user-settings'
};

@Injectable()
export class UserSettingsService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getUserSettings(): Observable<OperationDataResult<UserSettingsModel>> {
    return this.getWithOperationDataResult<UserSettingsModel>(UserSettingsMethods.UserSettings);
  }

  updateUserSettings(model: UserSettingsModel): Observable<OperationResult> {
    return this.postModelOperationResult<UserSettingsModel>(UserSettingsMethods.UserSettings, model);
  }
}
