import { Injectable } from '@angular/core';
import { AppMenuStore } from '../store';
import { AppMenuQuery } from '../query';
import { AppMenuService } from 'src/app/common/services';
import { map } from 'rxjs/operators';
import { MenuItemModel, UserMenuModel } from 'src/app/common/models';
import { Observable } from 'rxjs';

@Injectable()
export class AppMenuStateService {
  constructor(
    private store: AppMenuStore,
    private service: AppMenuService,
    private query: AppMenuQuery
  ) {}
  private responseIsLoading = false;

  getAppMenu(takeFromCache = true): Observable<UserMenuModel> {
    if (takeFromCache && this.query.currentAppMenu) {
      return this.appMenuObservable;
    } else if (!this.responseIsLoading) {
      this.responseIsLoading = true;
      this.service.getAppMenuFromServer().subscribe(
        (response) => {
          if (response && response.success && response.model) {
            if (!this.query.currentAppMenu) {
              this.store.set({ 0: response.model });
            } else {
              this.store.update(0, response.model);
            }
          }
          this.responseIsLoading = false;
        },
        () => (this.responseIsLoading = false)
      );
      return this.appMenuObservable;
    } else {
      // so that the second request does not start until the first one is completed
      return this.appMenuObservable;
    }
  }

  get appMenuObservable() {
    return this.query.userMenu$;
  }

  getTitleByUrl(href: string): string {
    if (
      this.query.currentAppMenu &&
      this.query.currentAppMenu.leftMenu &&
      this.query.currentAppMenu.leftMenu.length > 0 &&
      this.query.currentAppMenu.rightMenu &&
      this.query.currentAppMenu.rightMenu.length > 0
    ) {
      if (href.charAt(0) !== '/') {
        href = '/' + href;
      }
      let title = this.searchTitle(href, this.query.currentAppMenu.leftMenu);
      if (!title) {
        title = this.searchTitle(href, this.query.currentAppMenu.rightMenu);
      }
      return title;
    }
  }

  private searchTitle(href: string, menuItems: MenuItemModel[]): string {
    for (const menuItem of menuItems) {
      let menuItemLink = menuItem.link;
      if (menuItemLink !== '') {
        if (menuItemLink != null) {
          if (menuItemLink.charAt(0) !== '/') {
            menuItemLink = `/${menuItemLink}`;
          }
        }
        if (menuItemLink === href) {
          return menuItem.name;
        }
      }
      if (menuItem.menuItems.length > 0) {
        const title = this.searchTitle(href, menuItem.menuItems);
        if (title) {
          return title;
        }
      }
    }
    return '';
  }
}
