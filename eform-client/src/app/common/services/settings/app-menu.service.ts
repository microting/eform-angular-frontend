import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
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

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAppMenu(takeFromCache = true): Observable<UserMenuModel> {
    return new Observable<UserMenuModel>((observer) => {
      if (this.userMenu && takeFromCache) {
        observer.next(this.userMenu);
      } else {
        this.get(AppMenuMethods.UserMenu)
          .subscribe((userMenu: OperationDataResult<UserMenuModel>) => {
            if (userMenu && userMenu.success) {
              this.userMenu = userMenu.model;
              observer.next(userMenu.model);
            }
          });
      }
    });
  }
}
