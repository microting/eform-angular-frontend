import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdminSettingsModel,
  HeaderSettingsModel,
  LoginPageSettingsModel,
  OperationDataResult,
  OperationResult, UserbackWidgetSettingModel,
} from 'src/app/common/models';
import { SettingsModel } from 'src/app/common/models/settings';
import { ApiBaseService } from 'src/app/common/services';
import {LanguagesModel} from "src/app/common/models/common/languages.model";

const SettingsMethods = {
  UpdateConnectionString: '/api/settings/connection-string',
  ConnectionStringExist: '/api/settings/connection-string-exist',
  GetAdminSettings: '/api/settings/admin',
  GetAssemblyVersion: '/api/settings/version',
  GetApplicationHostOs: '/api/settings/hostos',
  GetLatestVersion: '/api/settings/latest-version',
  ResetLoginPageSettings: '/api/settings/reset-login-page',
  ResetHeaderSettings: '/api/settings/reset-page-header',
  GetLoginPageSettings: '/api/settings/login-page',
  GetHeaderSettings: '/api/settings/page-header',
  GetAnonymousImage: 'api/images/login-page-images',
  GetAuthorizedImage: 'api/images/eform-images',
  UserbackWidget: 'api/settings/userback-widget',
  GetLanguages: 'api/settings/languages',
  UpdateLanguages: 'api/settings/languages',
};

@Injectable()
export class AppSettingsService {
  loginPageSettingsModel: LoginPageSettingsModel = new LoginPageSettingsModel();
  constructor(private apiBaseService: ApiBaseService) {}

  updateConnectionString(model: SettingsModel): Observable<OperationResult> {
    return this.apiBaseService.post<SettingsModel>(
      SettingsMethods.UpdateConnectionString,
      model
    );
  }

  connectionStringExist(): Observable<OperationResult> {
    return this.apiBaseService.get(SettingsMethods.ConnectionStringExist);
  }

  getAdminSettings(): Observable<OperationDataResult<AdminSettingsModel>> {
    return this.apiBaseService.getNoToast<AdminSettingsModel>(
      SettingsMethods.GetAdminSettings
    );
  }

  getLoginPageSettings(): Observable<
    OperationDataResult<LoginPageSettingsModel>
  > {
    return this.apiBaseService.get<LoginPageSettingsModel>(
      SettingsMethods.GetLoginPageSettings
    );
  }

  getHeaderSettings(): Observable<OperationDataResult<HeaderSettingsModel>> {
    return this.apiBaseService.get<HeaderSettingsModel>(
      SettingsMethods.GetHeaderSettings
    );
  }

  updateAdminSettings(model: AdminSettingsModel): Observable<OperationResult> {
    return this.apiBaseService.post(SettingsMethods.GetAdminSettings, model);
  }

  resetLoginPageSettings(): Observable<OperationResult> {
    return this.apiBaseService.get(SettingsMethods.ResetLoginPageSettings);
  }

  resetHeaderSettings(): Observable<OperationResult> {
    return this.apiBaseService.get(SettingsMethods.ResetHeaderSettings);
  }

  getAssemblyVersion(): Observable<OperationDataResult<string>> {
    return this.apiBaseService.get<string>(SettingsMethods.GetAssemblyVersion);
  }

  getApplicationHostOs(): Observable<OperationDataResult<string>> {
    return this.apiBaseService.getNoToast<string>(SettingsMethods.GetApplicationHostOs);
  }

  getLatestVersion(): Observable<OperationDataResult<string>> {
    return this.apiBaseService.get<string>(SettingsMethods.GetLatestVersion);
  }

  getUserbackWidgetIsEnabled(): Observable<OperationDataResult<UserbackWidgetSettingModel>> {
    return this.apiBaseService.getNoToast(SettingsMethods.UserbackWidget);
  }

  updateUserbackWidgetIsEnabled(isEnableWidget: boolean): Observable<OperationResult> {
    return this.apiBaseService.put(SettingsMethods.UserbackWidget, isEnableWidget);
  }

  getLanguages(): Observable<OperationDataResult<LanguagesModel>> {
    return this.apiBaseService.getNoToast<LanguagesModel>(SettingsMethods.GetLanguages);
  }

  updateLanguages(model: LanguagesModel): Observable<OperationResult> {
    return this.apiBaseService.put(SettingsMethods.UpdateLanguages, model);
  }
}
