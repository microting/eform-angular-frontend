import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BaseService} from 'app/services/base.service';
import {Router} from '@angular/router';

import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {UserInfoModel} from 'app/models';

export let AdminMethods = {
  GetCurrentUser: '/api/account/user-info',
  GetUser: '/api/admin/user',
  GetAllUsers: '/api/admin/get-users',
  DeleteUser: '/api/admin/delete-user',
  CreateUser: '/api/admin/create-user',
  UpdateUser: '/api/admin/update-user',
  EnableTwoFactorAuth: 'api/admin/enable-two-factor',
  DisableTwoFactorAuth: 'api/admin/disable-two-factor'
};

@Injectable()
export class ExamplePnMainService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getCurrentUserInfo(): Observable<UserInfoModel> {
    return this.get(AdminMethods.GetCurrentUser);
  }
}
