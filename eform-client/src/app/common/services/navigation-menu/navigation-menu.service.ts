import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';
import {NavigationMenuItemModel, NavigationMenuModel} from 'src/app/common/models/navigation-menu';

const NavigationMenuMethods = {
  Menu: '/api/navigation-menu',
  MenuReset: '/api/navigation-menu/reset',
};

@Injectable()
export class NavigationMenuService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getNavigationMenu(): Observable<OperationDataResult<NavigationMenuModel>> {
    return this.get<NavigationMenuModel>(NavigationMenuMethods.Menu);
  }

  updateNavigationMenu(model: NavigationMenuItemModel[]): Observable<OperationResult> {
    return this.put<any>(NavigationMenuMethods.Menu, model);
  }

  restNavigationMenu(): Observable<OperationResult> {
    return this.post<any>(NavigationMenuMethods.MenuReset, {});
  }

}
