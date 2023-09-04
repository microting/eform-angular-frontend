import {Injectable} from '@angular/core';
import {AppMenuStore} from '../store';
import {AppMenuQuery} from '../query';
import {AppMenuService} from 'src/app/common/services';
import {catchError} from 'rxjs/operators';
import {MenuItemModel} from 'src/app/common/models';

@Injectable()
export class AppMenuStateService {
  constructor(
    private store: AppMenuStore,
    private service: AppMenuService,
    private query: AppMenuQuery
  ) {
    this.query.selectLoading().subscribe(x => this.isLoading = x);
    this.store.setLoading(false);
  }

  isLoading: boolean;

  getAppMenu() {
    if (!this.isLoading) {
      this.store.reset();
      this.store.setLoading(true);
      this.service.getAppMenuFromServer()
        .pipe(
          catchError((err, caught) => {
            this.store.setLoading(false);
            return caught;
          })
        )
        .subscribe(
          (response) => {
            if (response && response.success && response.model) {
              //if (!this.query.currentAppMenu) {
                this.store.set({0: response.model});
              //} else {
              //  this.store.update(0, response.model);
              //}
            }
            this.store.setLoading(false);
          },
        );
    }
  }

  get appMenuObservable() {
    return this.query.userMenu$;
  }

  get userMenuLeftAsync() {
    return this.query.userMenuLeft$;
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
      if (href.includes('?')) {
        href = href.substring(0, href.indexOf('?'));
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
