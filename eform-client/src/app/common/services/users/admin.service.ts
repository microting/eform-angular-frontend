import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  Paged,
  UserInfoModel,
  UserInfoRequestModel,
  UserRegisterModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

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
export class AdminService {
  private apiBaseService = inject(ApiBaseService);


  getAllUsers(
    model: UserInfoRequestModel
  ): Observable<OperationDataResult<Paged<UserInfoModel>>> {
    return this.apiBaseService.post<Paged<UserInfoModel>>(
      AdminMethods.GetAllUsers,
      model
    );
  }

  getCurrentUserInfo(): Observable<UserInfoModel> {
    return this.apiBaseService.get(AdminMethods.GetCurrentUser);
  }

  getUser(userId: number): Observable<OperationDataResult<UserRegisterModel>> {
    return this.apiBaseService.get<UserRegisterModel>(
      AdminMethods.GetUser + '/' + userId
    );
  }

  createUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.apiBaseService.post<UserRegisterModel>(
      AdminMethods.CreateUser,
      model
    );
  }

  updateUser(model: UserRegisterModel): Observable<OperationResult> {
    return this.apiBaseService.post<UserRegisterModel>(
      AdminMethods.UpdateUser,
      model
    );
  }

  deleteUser(userId: number): Observable<OperationResult> {
    return this.apiBaseService.get(AdminMethods.DeleteUser + '/' + userId);
  }

  enableTwoFactorAuth(): Observable<OperationResult> {
    return this.apiBaseService.get(AdminMethods.EnableTwoFactorAuth);
  }

  disableTwoFactorAuth(): Observable<OperationResult> {
    return this.apiBaseService.get(AdminMethods.DisableTwoFactorAuth);
  }

  resetPassword(id) {
    return this.apiBaseService.get('/api/admin/reset-password/' + id);
  }
}
