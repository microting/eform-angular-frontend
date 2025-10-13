import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, UserMenuModel } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const AppMenuMethods = {
  UserMenu: '/api/menu/current-user',
};

@Injectable()
export class AppMenuService {
  private apiBaseService = inject(ApiBaseService);


  getAppMenuFromServer(): Observable<OperationDataResult<UserMenuModel>> {
    return this.apiBaseService.get(AppMenuMethods.UserMenu);
  }
}
