import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';
import {AuthResponseModel, LoginRequestModel} from 'app/models/auth';
import {Observable} from 'rxjs/Observable';
import {BaseService} from '../base.service';

export let AuthMethods = {
  Login: 'api/auth/token',
  Logout: 'api/auth/logout',
  CheckToken: '/auth/is-token-actual',
  Restore: '/auth/restore',
  LoginAsUser: '/auth/login-as-user'
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

  get isAuth(): boolean {
    const auth = localStorage.getItem('currentAuth');
    if (auth) {
      return true;
    } else {
      return false;
    }
  }
  // loginAsUser(userId: number): Observable<any> {
  //   return this.post(AuthMethods.LoginAsUser, { user_id: userId }).map((result) => {
  //     return result;
  //   });
  // }
  //
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
