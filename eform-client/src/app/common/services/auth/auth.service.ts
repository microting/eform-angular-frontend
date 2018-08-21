import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseService} from '../base.service';

import {
  ChangePasswordModel,
  UserInfoModel,
  AuthResponseModel,
  LoginRequestModel,
  PasswordRestoreModel,
  GoogleAuthenticatorModel,
  GoogleAuthInfoModel, OperationDataResult, OperationResult
} from 'src/app/common/models';

export let AuthMethods = {
  Login: 'api/auth/token',
  Logout: 'api/auth/logout',
  CheckToken: '/auth/is-token-actual',
  Restore: '/auth/restore',
  ChangePassword: 'api/account/change-password',
  RestoreUserPassword: '/api/account/reset-password',
  EmailRecoveryLink: '/api/account/forgot-password',
  ResetAdminPassword: '/api/account/reset-admin-password',
  TwoFactorAuthInfo: 'api/auth/two-factor-info',
  LoginAndGetGoogleAuthKey: 'api/auth/google-auth-key',
  GetGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  UpdateGoogleAuthenticatorInfo: 'api/auth/google-auth-info',
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info'
};

@Injectable()
export class AuthService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  login(loginInfo: LoginRequestModel): Observable<AuthResponseModel> {
    let body = new HttpParams();
    body = body.append('username', loginInfo.username);
    body = body.append('password', loginInfo.password);
    body = body.append('grant_type', loginInfo.grant_type);
    if (loginInfo.code) {
      body = body.append('code', loginInfo.code);
    }
    debugger;
    return this.postUrlEncoded(AuthMethods.Login, body).pipe(map((result) => {
      return result;
    }));
  }

  restorePassword(model: PasswordRestoreModel): Observable<any> {
    return this.post(AuthMethods.RestoreUserPassword, model).pipe(map((result) => {
      return result;
    }));
  }

  resetAdminPassword(code: string): Observable<any> {
    const paramsObject = {
      code: code
    };
    return this.get(AuthMethods.ResetAdminPassword, paramsObject).pipe(map((result) => {
      return result;
    }));
  }

  sendEmailRecoveryLink(rawValue: any): Observable<any> {
    return this.post(AuthMethods.EmailRecoveryLink, {email: rawValue.email}).pipe(map((result) => {
      return result;
    }));
  }

  get isAuth(): boolean {
    const auth = localStorage.getItem('currentAuth');
    if (auth) {
      return true;
    } else {
      return false;
    }
  }

  get currentRole(): string {
    const auth: UserInfoModel = JSON.parse(localStorage.getItem('currentAuth'));
    if (auth && auth.role) {
      return auth.role;
    }
    return '';
  }

  changePassword(model: ChangePasswordModel): Observable<any> {
    return this.post(AuthMethods.ChangePassword, model).pipe(map((result) => {
      return result;
    }));
  }

  logout(): Observable<any> {
    return this.get(AuthMethods.Logout);
  }

  twoFactorAuthInfo(): Observable<OperationDataResult<boolean>> {
    return this.get(AuthMethods.TwoFactorAuthInfo);
  }

  loginAndGetGoogleAuthKey(loginInfo: LoginRequestModel): Observable<OperationDataResult<GoogleAuthenticatorModel>> {
    return this.post(AuthMethods.LoginAndGetGoogleAuthKey, loginInfo);
  }

  getGoogleAuthenticatorInfo(): Observable<OperationDataResult<GoogleAuthInfoModel>> {
    return this.get(AuthMethods.GetGoogleAuthenticatorInfo);
  }

  updateGoogleAuthenticatorInfo(model: GoogleAuthInfoModel ): Observable<OperationResult> {
    return this.post(AuthMethods.UpdateGoogleAuthenticatorInfo, model);
  }

  deleteGoogleAuthenticatorInfo(): Observable<OperationResult> {
    return this.delete(AuthMethods.GetGoogleAuthenticatorInfo);
  }
}
