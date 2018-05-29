import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

import {BaseService} from './base.service';
import {OperationResult, SettingsMethods, OperationDataResult} from '../modules/helpers/helpers.module';
import {AdminSettingsModel, SettingsModel,
  LoginPageSettingsModel, HeaderSettingsModel} from 'app/models';

@Injectable()
export class SettingsService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  updateConnectionString(model: SettingsModel): Observable<OperationResult> {
    return this.postModelOperationResult<SettingsModel>(SettingsMethods.UpdateConnectionString, model);
  }
  connectionStringExist(): Observable<OperationResult> {
    return this.getWithOperationResult(SettingsMethods.ConnectionStringExist);
  }
  getAdminSettings(): Observable<OperationDataResult<AdminSettingsModel>> {
    return this.getWithOperationDataResult<AdminSettingsModel>(SettingsMethods.GetAdminSettings);
  }
  getLoginPageSettings(): Observable<OperationDataResult<LoginPageSettingsModel>> {
    return this.getWithOperationDataResult<LoginPageSettingsModel>(SettingsMethods.GetLoginPageSettings);
  }
  getHeaderSettings(): Observable<OperationDataResult<HeaderSettingsModel>> {
    return this.getWithOperationDataResult<HeaderSettingsModel>(SettingsMethods.GetHeaderSettings);
  }
  updateAdminSettings(model: AdminSettingsModel): Observable<OperationResult> {
    return this.postModelOperationResult(SettingsMethods.GetAdminSettings, model);
  }
  resetLoginPageSettings(): Observable<OperationResult> {
    return this.getWithOperationResult(SettingsMethods.ResetLoginPageSettings);
  }
  resetHeaderSettings(): Observable<OperationResult> {
    return this.getWithOperationResult(SettingsMethods.ResetHeaderSettings);
  }
}
