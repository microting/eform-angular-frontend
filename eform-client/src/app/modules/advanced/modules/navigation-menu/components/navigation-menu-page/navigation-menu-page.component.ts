import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
  NavigationMenuModel,
  NavigationMenuTranslationModel,
  CommonDictionaryModel,
} from 'src/app/common/models';
import {
  NavigationMenuService,
  SecurityGroupsService,
} from 'src/app/common/services';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import {
  NavigationMenuItemDeleteComponent,
  NavigationMenuItemEditComponent,
  NavigationMenuResetComponent,
} from '../';
import * as R from 'ramda';
import { AppMenuStateService, AuthStateService } from 'src/app/common/store';

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
  @ViewChild('resetMenuModal')
  resetMenuModal: NavigationMenuResetComponent;
  securityGroups: CommonDictionaryModel[] = [];
  navigationMenuModel: NavigationMenuModel = new NavigationMenuModel();

  navigationMenuSub$: Subscription;
  updateNavigationMenuSub$: Subscription;
  securityGroupsSub$: Subscription;
  resetSub$: Subscription;
  getAppMenuSub$: Subscription;

  get menuItemTypes() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    private dragulaService: DragulaService,
    private navigationMenuService: NavigationMenuService,
    private securityGroupsService: SecurityGroupsService,
    private authStateService: AuthStateService,
    private appMenuStateService: AppMenuStateService
  ) {
    dragulaService.createGroup('MENU_ITEMS', {
      moves: (el, container, handle) => {
        return handle.classList.contains('dragula-handle');
      },
      copy: (el, source) => {
        return source.id === 'mainMenu' || source.id === 'pluginMenu';
      },
      copyItem: (data: NavigationMenuItemModel) => {
        return { ...data, type: NavigationMenuItemTypeEnum.Link, isInternalLink: true, };
      },
      accepts: (el, target) => {
        // To avoid dragging from right to left container
        return (
          (target.classList.contains('dragula-item') ||
            (target.classList.contains('dragula-dropdown') &&
              !el.classList.contains('dragula-dropdown'))) &&
          target.id !== 'mainMenu' &&
          target.id !== 'pluginMenu'
        );
      },
    });
    this.dragulaService.drop().subscribe(({ name }) => {
      this.dragulaService.find(name).drake.cancel(true);
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
    this.getAppMenuSub$ = this.appMenuStateService
      .getAppMenu(false)
      .subscribe();
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

  ngOnDestroy(): void {
    this.dragulaService.destroy('MENU_ITEMS');
  }

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
    this.editMenuItemModal.show(
      { ...model },
      firstLevelIndex,
      secondLevelIndex
    );
  }

  onItemEditConfirm(model: NavigationMenuItemIndexedModel) {
    if (model.secondLevelIndex >= 0) {
      const updatedChildren = R.update(
        model.secondLevelIndex,
        model.item,
        this.navigationMenuModel.actualMenu[model.firstLevelIndex].children
      );
      this.navigationMenuModel.actualMenu[model.firstLevelIndex].children = [
        ...updatedChildren,
      ];
    } else {
      this.navigationMenuModel.actualMenu = R.update(
        model.firstLevelIndex,
        model.item,
        this.navigationMenuModel.actualMenu
      );
    }
  }

  onItemDeleteConfirm(model: NavigationMenuItemIndexedModel) {
    if (model.secondLevelIndex >= 0) {
      const updatedChildren = R.remove(
        model.secondLevelIndex,
        1,
        this.navigationMenuModel.actualMenu[model.firstLevelIndex].children
      );
      this.navigationMenuModel.actualMenu[model.firstLevelIndex] = {
        ...this.navigationMenuModel.actualMenu[model.firstLevelIndex],
        collapsed: false,
        children: updatedChildren,
      };
    } else {
      this.navigationMenuModel.actualMenu = R.remove(
        model.firstLevelIndex,
        1,
        this.navigationMenuModel.actualMenu
      );
    }
  }

  onResetMenuConfirm() {
    this.resetSub$ = this.navigationMenuService
      .restNavigationMenu()
      .subscribe((data) => {
        if (data && data.success) {
          this.getHeaderNavigationMenu();
          this.getNavigationMenu();
        }
      });
  }

  showResetNavigationMenuModal() {
    this.resetMenuModal.show();
  }

  getMenuTranslation(translations: NavigationMenuTranslationModel[]) {
    return translations.find(
      (x) => x.localeName === this.authStateService.currentUserLocale
    ).name;
  }
}
