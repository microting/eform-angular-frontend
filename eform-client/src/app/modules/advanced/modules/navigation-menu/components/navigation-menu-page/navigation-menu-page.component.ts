import { Component, OnDestroy, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {
  NavigationMenuItemModel,
  NavigationMenuModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuService } from 'src/app/common/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation-menu-page',
  templateUrl: './navigation-menu-page.component.html',
  styleUrls: ['./navigation-menu-page.component.scss'],
})
export class NavigationMenuPageComponent implements OnInit, OnDestroy {
  testActualMenu: any = [];
  navigationMenuSub$: Subscription;
  updateNavigationMenuSub$: Subscription;
  navigationMenuModel: NavigationMenuModel = {
    actualMenu: [],
    menuTemplates: [
      {
        id: 1,
        name: 'Main application',
        pluginId: null,
        items: [
          { id: 1, link: 'eforms', name: 'Eforms', collapsed: false },
          {
            id: 2,
            link: 'device-users',
            name: 'Device users',
            collapsed: false,
          },
          { id: 3, link: 'sites', name: 'Sites', collapsed: false },
          {
            id: 4,
            link: 'entity-select',
            name: 'Entity select',
            collapsed: false,
          },
          {
            id: 5,
            link: 'entity-search',
            name: 'Entity search',
            collapsed: false,
          },
          { id: 6, link: 'mailing', name: 'Mailing', collapsed: false },
        ],
        collapsed: false,
      },
      {
        id: 2,
        pluginId: 1,
        name: 'Items planning',
        items: [
          { id: 1, link: 'plannings', name: 'Plannings', collapsed: false },
          { id: 2, link: 'reports', name: 'Reports', collapsed: false },
        ],
        collapsed: false,
      },
    ],
  };

  constructor(
    private dragulaService: DragulaService,
    private navigationMenuService: NavigationMenuService
  ) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu' || source.id === 'pluginMenu';
      },
      copyItem: (data: any) => {
        debugger;
        return data;
      },
      accepts: (el, target, source, sibling) => {
        debugger;
        // To avoid dragging from right to left container
        return (
          ((target.classList.contains('dragula-dropdown') &&
            !el.classList.contains('dragula-dropdown')) ||
            // (!target.classList.contains('dragula-dropdown') &&
            //   !el.classList.contains('dragula-dropdown')) ||
            (!target.classList.contains('dragula-dropdown') &&
              el.classList.contains('dragula-dropdown'))) &&
          target.id !== 'mainMenu' &&
          target.id !== 'pluginMenu'
        );
        // return (target.id !== 'mainMenu' && target.id !== 'pluginMenu');
      },
    });
  }

  ngOnInit(): void {
    // this.getNavigationMenu();
  }

  getNavigationMenu() {
    this.navigationMenuSub$ = this.navigationMenuService
      .getNavigationMenu()
      .subscribe((data) => {
        if (data && data.success) {
          this.navigationMenuModel = data.model;
        }
      });
  }

  updateNavigationMenu() {
    this.updateNavigationMenuSub$ = this.navigationMenuService
      .updateNavigationMenu(this.navigationMenuModel.actualMenu)
      .subscribe(() => {});
  }

  manualAddItemToMenu(model: NavigationMenuItemModel) {
    this.navigationMenuModel.actualMenu = [
      ...this.navigationMenuModel.actualMenu,
      model,
    ];
  }

  ngOnDestroy(): void {}
}
