import { Injectable, inject } from '@angular/core';
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
import {ChangePasswordAdminModel} from '../../models/user/change-password-admin.model';

export let AuthMethods = {
  Login: 'api/auth/token',
  Delegated: 'api/auth/delegated',
  RefreshToken: 'api/auth/token/refresh',
  Logout: 'api/auth/logout',
  Claims: 'api/auth/claims',
  CheckToken: '/auth/is-token-actual',
  Restore: '/auth/restore',
  ChangePassword: 'api/account/change-password',
  ChangePasswordAdmin: 'api/account/change-password-admin',
  RestoreUserPassword: '/api/account/reset-password',
  EmailRecoveryLink: '/api/account/forgot-password',
};

@Injectable()
export class AuthService {
  private apiBaseService = inject(ApiBaseService);


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

  /**
   * Exchanges a portal-issued delegated-access assertion for a session token.
   * JSON body only - the assertion is credential-equivalent and must never be in a URL.
   * Errors are deliberately NOT swallowed here: the HTTP error interceptor lets this call's
   * failures through so the landing page can show the refusal.
   */
  loginDelegated(assertion: string): Observable<AuthResponseModel> {
    return this.apiBaseService
      .postNoToast(AuthMethods.Delegated, {assertion})
      .pipe(map((result) => (result?.success ? result.model : null)));
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
        if (result.success) {
          return normalizeUserClaimNames(result.model);
        } else {
          return null;
        }
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

  changePasswordAdmin(model: ChangePasswordAdminModel): Observable<any> {
    return this.apiBaseService.post(AuthMethods.ChangePasswordAdmin, model).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
