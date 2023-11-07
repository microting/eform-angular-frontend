import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AuthResponseModel,
  ChangePasswordModel,
  LoginRequestModel,
  OperationDataResult,
  PasswordRestoreModel,
  UserClaimsModel,
} from 'src/app/common/models';
import { normalizeUserClaimNames } from 'src/app/common/helpers';
import { ApiBaseService } from 'src/app/common/services';
import {HttpParams} from '@angular/common/http';

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
  ResetAdminPassword: '/api/account/reset-admin-password',
};

@Injectable()
export class AuthService {
  constructor(
    private apiBaseService: ApiBaseService,
  ) {}

  login(loginInfo: LoginRequestModel): Observable<AuthResponseModel> {
    let body = new HttpParams();
    body = body.append('username', loginInfo.username);
    body = body.append('password', loginInfo.password);
    body = body.append('grant_type', loginInfo.grant_type);
    if (loginInfo.code) {
      body = body.append('code', loginInfo.code);
    }
    return this.apiBaseService.postUrlEncoded(AuthMethods.Login, body).pipe(
    // return this.apiBaseService.post(AuthMethods.Login, loginInfo).pipe(
      map((result) => {
        return result.model;
      })
    );
  }

  restorePassword(model: PasswordRestoreModel): Observable<any> {
    return this.apiBaseService
      .post(AuthMethods.RestoreUserPassword, model)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  resetAdminPassword(code: string): Observable<any> {
    const paramsObject = {
      code: code,
    };
    return this.apiBaseService
      .get(AuthMethods.ResetAdminPassword, paramsObject)
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  sendEmailRecoveryLink(rawValue: any): Observable<any> {
    return this.apiBaseService
      .post(AuthMethods.EmailRecoveryLink, {
        email: rawValue.email,
      })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  obtainUserClaims(): Observable<UserClaimsModel> {
    return this.apiBaseService.get(AuthMethods.Claims).pipe(
      map((result) => {
        return normalizeUserClaimNames(result.model);
      })
    );
  }

  refreshToken(): Observable<OperationDataResult<AuthResponseModel>> {
    return this.apiBaseService.get(AuthMethods.RefreshToken).pipe(
      map((result) => {
        return result;
      })
    );
  }

  changePassword(model: ChangePasswordModel): Observable<any> {
    return this.apiBaseService.post(AuthMethods.ChangePassword, model).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
