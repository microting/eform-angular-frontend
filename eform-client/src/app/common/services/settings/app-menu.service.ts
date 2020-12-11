import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  OperationDataResult, UserMenuModel
} from 'src/app/common/models';

import {BaseService} from '../base.service';

const AppMenuMethods = {
  UserMenu: '/api/menu/current-user'
};

@Injectable()
export class AppMenuService extends BaseService {

  private userMenu: UserMenuModel;
  public userMenuBehaviorSubject = new BehaviorSubject<UserMenuModel>({leftMenu: [], rightMenu: []});
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
    this.getAppMenu();
  }

  getAppMenu(takeFromCache = true): void {
      if (this.userMenu && takeFromCache) {
        this.userMenuBehaviorSubject.next(this.userMenu);
      } else {
        this.get(AppMenuMethods.UserMenu)
          .subscribe((userMenu: OperationDataResult<UserMenuModel>) => {
            if (userMenu && userMenu.success) {
              this.userMenu = userMenu.model;
              this.userMenuBehaviorSubject.next(userMenu.model);
            }
          });
      }
  }
}
