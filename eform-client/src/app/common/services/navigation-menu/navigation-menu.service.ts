import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const NavigationMenuMethods = {
  Menu: '/api/navigation-menu',
};

@Injectable()
export class NavigationMenuService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getNavigationMenu(): Observable<OperationDataResult<any>> {
    return this.get<any>(NavigationMenuMethods.Menu);
  }

  updateNavigationMenu(model: any): Observable<OperationResult> {
    return this.put<any>(NavigationMenuMethods.Menu, model);
  }

  deleteNavigationMenu(id: number): Observable<OperationResult> {
    return this.delete(NavigationMenuMethods.Menu + '/' + id);
  }

  createNavigationMenu(model: any): Observable<OperationResult> {
    return this.post<any>(NavigationMenuMethods.Menu, model);
  }

}
