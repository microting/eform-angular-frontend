import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {AuthResponseModel, LoginRequestModel} from 'app/models/auth';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';
import {ChangePasswordModel, UserInfoModel} from 'app/models';
import {PasswordRestoreModel} from '../../models/auth/password-restore.model';

export let AuthMethods = {
  Login: 'api/auth/token',
  Logout: 'api/auth/logout',
  CheckToken: '/auth/is-token-actual',
  Restore: '/auth/restore',
  ChangePassword: 'api/account/change-password',
  RestoreUserPassword: '/api/account/reset-password',
  EmailRecoveryLink: '/api/account/forgot-password',
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
    return this.postForm(AuthMethods.Login, body).map((result) => {
      return new AuthResponseModel(result);
    });
  }

  restorePassword(model: PasswordRestoreModel): Observable<any> {
    return this.post(AuthMethods.RestoreUserPassword, model).map((result) => {
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
  // loginAsUser(userId: number): Observable<any> {
  //   return this.post(AuthMethods.LoginAsUser, { user_id: userId }).map((result) => {
  //     return result;
  //   });
  // }
  //
  changePassword(model: ChangePasswordModel): Observable<any> {
    return this.post(AuthMethods.ChangePassword, model).map((result) => {
      return result;
    });
  }
   logout(): Observable<any> {
     return this.post(AuthMethods.Logout, {});
   }
  //
  // restorePassword (email: string): Observable<string> {
  //   return this.post(AuthMethods.Restore, { email: email }).map((result) => {
  //     return result;
  //   });
  // }
}
