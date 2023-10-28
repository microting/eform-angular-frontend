import {Injectable} from '@angular/core';
import {MenuItemModel} from 'src/app/common/models';
import {leftAppMenus, rightAppMenus} from 'src/app/state/app-menu/app-menu.selector';
import {Store} from '@ngrx/store';

@Injectable()
export class AppMenuStateService {
  constructor(
    private store: Store,
  ) {
  }
  public rightAppMenus$ = this.store.select(rightAppMenus);
  public leftAppMenus$ = this.store.select(leftAppMenus);

  getTitleByUrl(href: string): string {
      if (href.charAt(0) !== '/') {
        href = '/' + href;
      }
      if (href.includes('?')) {
        href = href.substring(0, href.indexOf('?'));
      }

      let title = '';

      this.leftAppMenus$.subscribe((leftMenu: MenuItemModel[]) => {
        title = this.searchTitle(href, leftMenu);
      });
      if (title === '') {
        this.rightAppMenus$.subscribe((rightMenu: MenuItemModel[]) => {
          title = this.searchTitle(href, rightMenu);
        });
      }
      return title;
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
