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

  public userMenuBehaviorSubject = new BehaviorSubject<UserMenuModel>({leftMenu: [], rightMenu: []});

  private userMenuModel: UserMenuModel;

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
    this.getAppMenu();
  }

  getAppMenu(takeFromCache = true): void {
    if (this.userMenuModel && takeFromCache) {
      this.userMenuBehaviorSubject.next(this.userMenuModel);
    } else {
      this.get(AppMenuMethods.UserMenu)
        .subscribe((userMenu: OperationDataResult<UserMenuModel>) => {
          if (userMenu && userMenu.success) {
            this.userMenuModel = userMenu.model;
            this.userMenuBehaviorSubject.next(this.userMenuModel);
          }
        });
    }
  }
}
