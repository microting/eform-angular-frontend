import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OperationDataResult, UserMenuModel } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const AppMenuMethods = {
  UserMenu: '/api/menu/current-user',
};

@Injectable()
export class AppMenuService {
  private userMenu: UserMenuModel;
  public userMenuBehaviorSubject = new BehaviorSubject<UserMenuModel>({
    leftMenu: [],
    rightMenu: [],
  });
  constructor(private apiBaseService: ApiBaseService) {
    this.getAppMenu();
  }

  getAppMenu(takeFromCache = true): void {
    if (this.userMenu && takeFromCache) {
      this.userMenuBehaviorSubject.next(this.userMenu);
    } else {
      this.apiBaseService
        .get(AppMenuMethods.UserMenu)
        .subscribe((userMenu: OperationDataResult<UserMenuModel>) => {
          if (userMenu && userMenu.success) {
            this.userMenu = userMenu.model;
            this.userMenuBehaviorSubject.next(userMenu.model);
          }
        });
    }
  }
}
