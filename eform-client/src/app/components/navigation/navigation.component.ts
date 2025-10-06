import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Observable, Subscription} from 'rxjs';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth, selectCurrentUserClaims, leftAppMenus, loadAppMenu} from 'src/app/state';
import {snakeToCamel} from 'src/app/common/helpers';

interface MenuNode {
  name: string;
  menuItems?: MenuNode[];
  link: string;
  e2EId: string;
  position: number;
  isInternalLink: boolean;
  guards: Array<string>;
}

@AutoUnsubscribe()
@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    standalone: false
})
export class NavigationComponent implements OnInit, OnDestroy {
  router = inject(Router);
  private authStore = inject(Store);

  @Output() clickOnLink: EventEmitter<void> = new EventEmitter<void>();

  treeControl = new NestedTreeControl<MenuNode>(node => node.menuItems);

  hasChild = (_: number, node: MenuNode) => !!node.menuItems && node.menuItems.length > 0;

  menu = new MatTreeNestedDataSource<MenuNode>();

  getAppMenuSub$: Subscription;
  public allAppMenus$ = this.authStore.select(leftAppMenus);
  private selectAuthIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private selectCurrentUserClaims$ = this.authStore.select(selectCurrentUserClaims);

  ngOnDestroy() {
  }

  ngOnInit() {
    this.selectAuthIsAuth$.pipe(filter(isAuth => isAuth === true)).subscribe(() => {
      this.authStore.dispatch(loadAppMenu());
      this.getAppMenuSub$ = this.allAppMenus$.subscribe(x => {
        if (x.length > 0) {
          this.menu.data = [...x];
          this.restoreOpenedMenu();
        }
      });
    });
  }

  checkGuards(guards: string[]): Observable<boolean> {
    if (guards.length === 0) {
      return new Observable<boolean>(x => x.next(true));
    }
    return this.selectCurrentUserClaims$.pipe(map(x => {
      for (const guard of guards) {
        if (x[snakeToCamel(guard)]) {
          return true;
        }
      }
      return false;
    }));
  }

  onClickOnNode() {
    this.clickOnLink.emit();
  }

  private restoreOpenedMenu() {
    const href = this.router.url;
    const nodes = this.getNodesByUrl(href);
    if(nodes.length > 0) {
      nodes.forEach(node => this.expandNode(node));
    }
  }

  private getNodesByUrl(href: string): MenuNode[] {
    if (this.menu.data && this.menu.data.length > 0) {
      // if link no have required first symbol - it's add this symbol
      if (href.charAt(0) !== '/') {
        href = '/' + href;
      }
      return this.searchNodes(href, this.menu.data);
    }
  }

  private searchNodes(href: string, menuItems: MenuNode[]): MenuNode[] {
    for (const menuItem of menuItems) {
      let menuItemLink = menuItem.link || '';
      if (menuItemLink !== '') {
        // if link no have required first symbol - it's add this symbol
        if (menuItemLink.charAt(0) !== '/') {
            menuItemLink = `/${menuItemLink}`;
        }
        // if link eq searched link - return node
        if (menuItemLink === href) {
          return [menuItem];
        }
      }
      if (menuItem.menuItems.length > 0) {
        const nodes = this.searchNodes(href, menuItem.menuItems);
        if (nodes.length > 0) {
          //this.expandNode(menuItem); // expand father node(nested node - it's searched node). works only if menu no deep
          return [...nodes, menuItem]; // add father node for deep menu
        }
      }
    }
    return []; // current link is not found. Maybe user in right menu or etc.
  }

  private expandNode(node: MenuNode) {
    this.treeControl.expand(node);
  }
}
