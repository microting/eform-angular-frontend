import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';

import {
  GoogleAuthenticatorModel,
  GoogleAuthInfoModel,
  LoginRequestModel,
  OperationDataResult,
  OperationResult
} from 'src/app/common/models';
import {BaseService} from '../base.service';
import {TimezonesModel} from 'src/app/common/models/common/timezones.model';
import {AuthMethods} from 'src/app/common/services';

const GoogleAuthMethods = {
  TwoFactorAuthInfo: 'api/auth/two-factor-info',
  LoginAndGetGoogleAuthKey: 'api/auth/google-auth-key',
  GetGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  TimeZones: 'api/account/timezones'
};

@Injectable()
export class GoogleAuthService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  twoFactorAuthInfo(): Observable<OperationDataResult<boolean>> {
    return this.get(GoogleAuthMethods.TwoFactorAuthInfo);
  }

  loginAndGetGoogleAuthKey(loginInfo: LoginRequestModel): Observable<OperationDataResult<GoogleAuthenticatorModel>> {
    return this.post(GoogleAuthMethods.LoginAndGetGoogleAuthKey, loginInfo);
  }

  getGoogleAuthenticatorInfo(): Observable<OperationDataResult<GoogleAuthInfoModel>> {
    return this.get(GoogleAuthMethods.GetGoogleAuthenticatorInfo);
  }

  updateGoogleAuthenticatorInfo(model: GoogleAuthInfoModel ): Observable<OperationResult> {
    return this.post(GoogleAuthMethods.UpdateGoogleAuthenticatorInfo, model);
  }

  deleteGoogleAuthenticatorInfo(): Observable<OperationResult> {
    return this.delete(GoogleAuthMethods.GetGoogleAuthenticatorInfo);
  }

  allTimeZones(): Observable<OperationDataResult<TimezonesModel>> {
    return this.get(GoogleAuthMethods.TimeZones);
  }
}
