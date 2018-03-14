import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';
import {
  ChangePasswordModel,
  UserInfoModel,
  AuthResponseModel,
  LoginRequestModel,
  PasswordRestoreModel,
  GoogleAuthenticatorModel,
  GoogleAuthInfoModel
} from 'app/models';
import {OperationDataResult, OperationResult} from '../../modules/helpers/operation.models';

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
  DeleteGoogleAuthenticatorInfo: 'api/auth/google-auth-info'
};

@Injectable()
export class AuthService extends BaseService {
  constructor(private _http: Http, router: Router) {
    super(_http, router);
  }

  login(loginInfo: LoginRequestModel): Observable<AuthResponseModel> {
    const body = new URLSearchParams();
    body.set('username', loginInfo.username);
    body.set('password', loginInfo.password);
    body.set('grant_type', loginInfo.grant_type);
    if (loginInfo.code) {
      body.set('code', loginInfo.code);
    }
    return this.postForm(AuthMethods.Login, body).map((result) => {
      return new AuthResponseModel(result);
    });
  }

  restorePassword(model: PasswordRestoreModel): Observable<any> {
    return this.post(AuthMethods.RestoreUserPassword, model).map((result) => {
      return result;
    });
  }

  resetAdminPassword(code: string): Observable<any> {
    return this.get(AuthMethods.ResetAdminPassword + '?code=' + code).map((result) => {
      return result;
    });
  }

  sendEmailRecoveryLink(rawValue: any): Observable<any> {
    return this.post(AuthMethods.EmailRecoveryLink, {email: rawValue.email}).map((result) => {
      return result;
    });
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
    return this.post(AuthMethods.ChangePassword, model).map((result) => {
      return result;
    });
  }

  logout(): Observable<any> {
    return this.get(AuthMethods.Logout);
  }

  public twoFactorAuthInfo(): Observable<OperationDataResult<boolean>> {
    return this.getWithOperationDataResult(AuthMethods.TwoFactorAuthInfo);
  }

  loginAndGetGoogleAuthKey(loginInfo: LoginRequestModel): Observable<OperationDataResult<GoogleAuthenticatorModel>> {
    const body = new URLSearchParams();
    body.set('username', loginInfo.username);
    body.set('password', loginInfo.password);
    return this.postForm(AuthMethods.LoginAndGetGoogleAuthKey, body);
  }

  public getGoogleAuthenticatorInfo(): Observable<OperationDataResult<GoogleAuthInfoModel>> {
    return this.getWithOperationDataResult(AuthMethods.GetGoogleAuthenticatorInfo);
  }

  public deleteGoogleAuthenticatorInfo(): Observable<OperationResult> {
    return this.delete(AuthMethods.GetGoogleAuthenticatorInfo);
  }

  // restorePassword (email: string): Observable<string> {
  //   return this.post(AuthMethods.Restore, { email: email }).map((result) => {
  //     return result;
  //   });
  // }
}
