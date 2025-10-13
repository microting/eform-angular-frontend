import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  GoogleAuthenticatorModel,
  GoogleAuthInfoModel,
  LoginRequestModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { TimezonesModel } from 'src/app/common/models/common/timezones.model';
import { ApiBaseService } from 'src/app/common/services';

const GoogleAuthMethods = {
  TwoFactorAuthInfo: 'api/auth/two-factor-info',
  LoginAndGetGoogleAuthKey: 'api/auth/google-auth-key',
  GetGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  TimeZones: 'api/account/timezones',
};

@Injectable()
export class GoogleAuthService {
  private apiBaseService = inject(ApiBaseService);


  twoFactorAuthInfo(): Observable<OperationDataResult<boolean>> {
    return this.apiBaseService.get(GoogleAuthMethods.TwoFactorAuthInfo);
  }

  loginAndGetGoogleAuthKey(
    loginInfo: LoginRequestModel
  ): Observable<OperationDataResult<GoogleAuthenticatorModel>> {
    return this.apiBaseService.post(
      GoogleAuthMethods.LoginAndGetGoogleAuthKey,
      loginInfo
    );
  }

  getGoogleAuthenticatorInfo(): Observable<
    OperationDataResult<GoogleAuthInfoModel>
  > {
    return this.apiBaseService.get(
      GoogleAuthMethods.GetGoogleAuthenticatorInfo
    );
  }

  updateGoogleAuthenticatorInfo(
    model: GoogleAuthInfoModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      GoogleAuthMethods.UpdateGoogleAuthenticatorInfo,
      model
    );
  }

  deleteGoogleAuthenticatorInfo(): Observable<OperationResult> {
    return this.apiBaseService.delete(
      GoogleAuthMethods.GetGoogleAuthenticatorInfo
    );
  }

  allTimeZones(): Observable<OperationDataResult<TimezonesModel>> {
    return this.apiBaseService.get(GoogleAuthMethods.TimeZones);
  }
}
