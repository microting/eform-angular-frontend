import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import {
  NavigationMenuItemModel,
  NavigationMenuModel,
} from 'src/app/common/models/navigation-menu';
import { ApiBaseService } from 'src/app/common/services';

const NavigationMenuMethods = {
  Menu: '/api/navigation-menu',
  MenuReset: '/api/navigation-menu/reset',
};

@Injectable()
export class NavigationMenuService {
  private apiBaseService = inject(ApiBaseService);


  getNavigationMenu(): Observable<OperationDataResult<NavigationMenuModel>> {
    return this.apiBaseService.get<NavigationMenuModel>(
      NavigationMenuMethods.Menu
    );
  }

  updateNavigationMenu(
    model: NavigationMenuItemModel[]
  ): Observable<OperationResult> {
    return this.apiBaseService.put<any>(NavigationMenuMethods.Menu, model);
  }

  restNavigationMenu(): Observable<OperationResult> {
    return this.apiBaseService.post<any>(NavigationMenuMethods.MenuReset, {});
  }
}
