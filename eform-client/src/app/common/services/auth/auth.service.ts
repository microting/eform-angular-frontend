import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {
  AuthResponseModel,
  ChangePasswordModel,
  LoginRequestModel,
  OperationDataResult,
  PasswordRestoreModel,
  UserClaimsModel,
  UserInfoModel
} from 'src/app/common/models';
import {BaseService} from '../base.service';
import {normalizeUserClaimNames} from 'src/app/common/helpers';

export let AuthMethods = {
  Login: 'api/auth/token',
  RefreshToken: 'api/auth/token/refresh',
  Logout: 'api/auth/logout',
  Claims: 'api/auth/claims',
  CheckToken: '/auth/is-token-actual',
  Restore: '/auth/restore',
  ChangePassword: 'api/account/change-password',
  RestoreUserPassword: '/api/account/reset-password',
  EmailRecoveryLink: '/api/account/forgot-password',
  ResetAdminPassword: '/api/account/reset-admin-password'
};

@Injectable()
export class AuthService extends BaseService {
  userClaimsUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  get bearerToken(): string {
    const user: AuthResponseModel = JSON.parse(localStorage.getItem('currentAuth'));
    return 'Bearer ' + user.access_token;
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

  get currentUserFullName(): string {
    const auth: UserInfoModel = JSON.parse(localStorage.getItem('currentAuth'));
    if (auth) {
      return auth.firstName + ' ' + auth.lastName;
    }
    return '';
  }

  get userClaims(): UserClaimsModel {
    return JSON.parse(localStorage.getItem('userClaims'));
  }

  login(loginInfo: LoginRequestModel): Observable<AuthResponseModel> {
    let body = new HttpParams();
    body = body.append('username', loginInfo.username);
    body = body.append('password', loginInfo.password);
    body = body.append('grant_type', loginInfo.grant_type);
    if (loginInfo.code) {
      body = body.append('code', loginInfo.code);
    }
    return this.postUrlEncoded(AuthMethods.Login, body).pipe(map((result) => {
      return result.model;
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

  obtainUserClaims(): Observable<OperationDataResult<{ [key: string]: string }>> {
    return this.get(AuthMethods.Claims).pipe(map((result) => {
      return {...result, model: normalizeUserClaimNames(result.model)};
    }));
  }

  refreshToken(): Observable<OperationDataResult<AuthResponseModel>> {
    return this.get(AuthMethods.RefreshToken).pipe(map((result) => {
      return result;
    }));
  }

  changePassword(model: ChangePasswordModel): Observable<any> {
    return this.post(AuthMethods.ChangePassword, model).pipe(map((result) => {
      return result;
    }));
  }

  logout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentAuth');
    this.router.navigate(['/auth']).then();
  }
}
