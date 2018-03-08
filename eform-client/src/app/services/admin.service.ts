import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BaseService} from 'app/services/base.service';
import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {UserInfoModel, UserRegisterModel} from 'app/models/user';
import {AdminMethods} from 'app/modules/helpers/app.constants';
import {PaginationModel} from 'app/models/common';
import {UserInfoModelList} from 'app/models/user/user-info-model-list';
import {Router} from '@angular/router';

@Injectable()
export class AdminService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAllUsers(model: PaginationModel): Observable<OperationDataResult<UserInfoModelList>> {
    return this.postModelOperationDataResult<PaginationModel, UserInfoModelList>(AdminMethods.GetAllUsers, model);
  }

  public getCurrentUserInfo(): Observable<UserInfoModel> {
    return this.get(AdminMethods.GetCurrentUser);
  }

  public getUser = (userId: number): Observable<OperationDataResult<UserRegisterModel>> => {
    return this.getWithOperationDataResult<UserRegisterModel>(AdminMethods.GetUser + '/' + userId);
  }

  public createUser = (model: UserRegisterModel): Observable<OperationResult> => {
    return this.postModelOperationResult<UserRegisterModel>(AdminMethods.CreateUser, model);
  }

  public updateUser = (model: UserRegisterModel): Observable<OperationResult> => {
    return this.postModelOperationResult<UserRegisterModel>(AdminMethods.UpdateUser, model);
  }

  public deleteUser = (userId: number): Observable<OperationResult> => {
    return this.getWithOperationResult(AdminMethods.DeleteUser + '/' + userId);
  }

  public enableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.EnableTwoFactorAuth);
  }

  public disableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.DisableTwoFactorAuth);
  }
}
