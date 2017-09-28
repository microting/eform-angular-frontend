import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationResult, SettingsMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {Router} from '@angular/router';
import {SettingsModel} from 'app/models/settings';
import {OperationDataResult} from 'app/modules/helpers/operation.models';
import {AdminSettingsModel} from 'app/models/settings/admin-settings.model';

@Injectable()
export class SettingsService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public updateConnectionString(model: SettingsModel): Observable<OperationResult> {
    return this.postModelOperationResult<SettingsModel>(SettingsMethods.UpdateConnectionString, model);
  }
  public connectionStringExist(): Observable<OperationResult> {
    return this.getWithOperationResult(SettingsMethods.ConnectionStringExist);
  }
  public getAdminSettings(): Observable<OperationDataResult<AdminSettingsModel>> {
    return this.getWithOperationDataResult<AdminSettingsModel>(SettingsMethods.GetAdminSettings);
  }
  public updateAdminSettings(model: AdminSettingsModel): Observable<OperationResult> {
    return this.postModelOperationResult(SettingsMethods.GetAdminSettings, model);
  }
}
