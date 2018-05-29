import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BaseService} from 'app/services/base.service';
import {Router} from '@angular/router';

import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {UserInfoModel, UserRegisterModel, UserInfoModelList, PaginationModel} from 'app/models';
import {AdminMethods} from 'app/modules/helpers/app.constants';


@Injectable()
export class AdminService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAllUsers(model: PaginationModel): Observable<OperationDataResult<UserInfoModelList>> {
    return this.postModelOperationDataResult<PaginationModel, UserInfoModelList>(AdminMethods.GetAllUsers, model);
  }

  getCurrentUserInfo(): Observable<UserInfoModel> {
    return this.get(AdminMethods.GetCurrentUser);
  }

  getUser(userId: number): Observable<OperationDataResult<UserRegisterModel>> {
    return this.getWithOperationDataResult<UserRegisterModel>(AdminMethods.GetUser + '/' + userId);
  }

  createUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.postModelOperationResult<UserRegisterModel>(AdminMethods.CreateUser, model);
  }

  updateUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.postModelOperationResult<UserRegisterModel>(AdminMethods.UpdateUser, model);
  }

  deleteUser(userId: number): Observable<OperationResult> {
    return this.getWithOperationResult(AdminMethods.DeleteUser + '/' + userId);
  }

  enableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.EnableTwoFactorAuth);
  }

  disableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.DisableTwoFactorAuth);
  }
}
