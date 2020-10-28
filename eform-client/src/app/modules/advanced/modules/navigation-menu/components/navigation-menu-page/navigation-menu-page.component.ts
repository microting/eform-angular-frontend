import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
  NavigationMenuModel,
} from 'src/app/common/models/navigation-menu';
import {
  NavigationMenuService,
  SecurityGroupsService,
} from 'src/app/common/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { NavigationMenuItemEditComponent } from '../menu-item/navigation-menu-item-edit/navigation-menu-item-edit.component';
import { NavigationMenuItemDeleteComponent } from '../menu-item/navigation-menu-item-delete/navigation-menu-item-delete.component';
import { CommonDictionaryModel } from 'src/app/common/models';
import * as R from 'ramda';
import { EventBrokerService } from 'src/app/common/helpers';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation-menu-page',
  templateUrl: './navigation-menu-page.component.html',
  styleUrls: ['./navigation-menu-page.component.scss'],
})
export class NavigationMenuPageComponent implements OnInit, OnDestroy {
  @ViewChild('deleteMenuItemModal')
  deleteMenuItemModal: NavigationMenuItemDeleteComponent;
  @ViewChild('editMenuItemModal')
  editMenuItemModal: NavigationMenuItemEditComponent;
  navigationMenuSub$: Subscription;
  updateNavigationMenuSub$: Subscription;
  securityGroupsSub$: Subscription;
  securityGroups: CommonDictionaryModel[] = [];
  navigationMenuModel: NavigationMenuModel = new NavigationMenuModel();
  // navigationMenuModel: NavigationMenuModel = {
  //   actualMenu: [],
  //   menuTemplates: [
  //     {
  //       id: 1,
  //       name: 'Main application',
  //       items: [
  //         {
  //           id: 1,
  //           link: 'eforms',
  //           name: 'Eforms',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Eforms',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 2,
  //           link: 'device-users',
  //           name: 'Device users',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Device users',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 3,
  //           link: 'sites',
  //           name: 'Sites',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Sites',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 4,
  //           link: 'entity-select',
  //           name: 'Entity select',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Entity select',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 5,
  //           link: 'entity-search',
  //           name: 'Entity search',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Entity search',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 6,
  //           link: 'mailing',
  //           name: 'Mailing',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Mailing',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //       ],
  //       collapsed: false,
  //     },
  //     {
  //       id: 2,
  //       name: 'Items planning',
  //       items: [
  //         {
  //           id: 1,
  //           link: 'plannings',
  //           name: 'Plannings',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Eforms',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //         {
  //           id: 2,
  //           link: 'reports',
  //           name: 'Reports',
  //           collapsed: false,
  //           translations: [
  //             {
  //               id: 1,
  //               name: 'Eforms',
  //               language: 'English',
  //               localeName: 'en-US',
  //             },
  //           ],
  //         },
  //       ],
  //       collapsed: false,
  //     },
  //   ],
  // };

  get menuItemTypes() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    private dragulaService: DragulaService,
    private navigationMenuService: NavigationMenuService,
    private securityGroupsService: SecurityGroupsService,
    private eventBrokerService: EventBrokerService
  ) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu' || source.id === 'pluginMenu';
      },
      copyItem: (data: NavigationMenuItemModel) => {
        return { ...data, type: NavigationMenuItemTypeEnum.Link };
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return (
          // ((target.classList.contains('dragula-dropdown') &&
          //   !el.classList.contains('dragula-dropdown')) ||
          //   // (!target.classList.contains('dragula-dropdown') &&
          //   //   !el.classList.contains('dragula-dropdown')) ||
          //   (!target.classList.contains('dragula-dropdown') &&
          //     el.classList.contains('dragula-dropdown'))) &&
          target.id !== 'mainMenu' && target.id !== 'pluginMenu'
        );
        // return (target.id !== 'mainMenu' && target.id !== 'pluginMenu');
      },
    });
  }

  ngOnInit(): void {
    this.getNavigationMenu();
    this.getSecurityGroups();
  }

  getSecurityGroups() {
    this.securityGroupsSub$ = this.securityGroupsService
      .getSecurityGroupsDictionary()
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model;
        }
      });
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

  getHeaderNavigationMenu() {
    this.eventBrokerService.emit<void>('get-navigation-menu', null);
  }

  updateNavigationMenu() {
    this.updateNavigationMenuSub$ = this.navigationMenuService
      .updateNavigationMenu(this.navigationMenuModel.actualMenu)
      .subscribe(() => {
        this.getHeaderNavigationMenu();
      });
  }

  manualAddItemToMenu(model: NavigationMenuItemModel) {
    this.navigationMenuModel.actualMenu = [
      ...this.navigationMenuModel.actualMenu,
      model,
    ];
  }

  ngOnDestroy(): void {}

  onItemDelete(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number | null
  ) {
    this.deleteMenuItemModal.show(model, firstLevelIndex, secondLevelIndex);
  }

  onItemEdit(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number | null
  ) {
    this.editMenuItemModal.show(model, firstLevelIndex, secondLevelIndex);
  }

  onItemEditConfirm(model: NavigationMenuItemIndexedModel) {
    if (model.secondLevelIndex) {
      this.navigationMenuModel.actualMenu = R.update(
        model.firstLevelIndex,
        R.update(
          model.secondLevelIndex,
          model.item,
          this.navigationMenuModel.actualMenu[model.firstLevelIndex]
        ),
        this.navigationMenuModel.actualMenu
      );
    } else {
      this.navigationMenuModel.actualMenu = R.update(
        model.firstLevelIndex,
        model.item,
        this.navigationMenuModel.actualMenu
      );
    }
  }

  onItemDeleteConfirm(model: NavigationMenuItemIndexedModel) {
    debugger;
    if (model.secondLevelIndex) {
      this.navigationMenuModel.actualMenu = R.update(
        model.firstLevelIndex,
        R.remove(
          model.secondLevelIndex,
          1,
          this.navigationMenuModel.actualMenu[model.firstLevelIndex].children
        ),
        this.navigationMenuModel.actualMenu
      );
    } else {
      this.navigationMenuModel.actualMenu = R.remove(
        model.firstLevelIndex,
        1,
        this.navigationMenuModel.actualMenu
      );
    }
    // Remove item from array
  }
}
