import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  OperationDataResult, UserMenuModel
} from 'src/app/common/models';

import {BaseService} from '../../base.service';

const AppMenuMethods = {
  UserMenu: '/api/menu/current-user'
};

@Injectable()
export class AppMenuService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAppMenu(): Observable<OperationDataResult<UserMenuModel>> {
    return this.get(AppMenuMethods.UserMenu);
  }
}
