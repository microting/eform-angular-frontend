import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  Paged,
  UserInfoModel,
  UserInfoRequestModel,
  UserRegisterModel,
} from 'src/app/common/models';
import { BaseService } from 'src/app/common/services/base.service';

const AdminMethods = {
  GetCurrentUser: '/api/account/user-info',
  GetUser: '/api/admin/user',
  GetAllUsers: '/api/admin/get-users',
  DeleteUser: '/api/admin/delete-user',
  CreateUser: '/api/admin/create-user',
  UpdateUser: '/api/admin/update-user',
  EnableTwoFactorAuth: 'api/admin/enable-two-factor',
  DisableTwoFactorAuth: 'api/admin/disable-two-factor',
};

@Injectable()
export class AdminService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllUsers(
    model: UserInfoRequestModel
  ): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    return this.post<Paged<UserInfoModel>>(AdminMethods.GetAllUsers, model);
  }

  getCurrentUserInfo(): Observable<UserInfoModel> {
    return this.get(AdminMethods.GetCurrentUser);
  }

  getUser(userId: number): Observable<OperationDataResult<UserRegisterModel>> {
    return this.get<UserRegisterModel>(AdminMethods.GetUser + '/' + userId);
  }

  createUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.post<UserRegisterModel>(AdminMethods.CreateUser, model);
  }

  updateUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.post<UserRegisterModel>(AdminMethods.UpdateUser, model);
  }

  deleteUser(userId: number): Observable<OperationResult> {
    return this.get(AdminMethods.DeleteUser + '/' + userId);
  }

  enableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.EnableTwoFactorAuth);
  }

  disableTwoFactorAuth(): Observable<OperationResult> {
    return this.get(AdminMethods.DisableTwoFactorAuth);
  }
}
