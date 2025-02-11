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
import {Subscription, take} from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import {
  NavigationMenuItemDeleteComponent,
  NavigationMenuItemEditComponent,
  NavigationMenuResetComponent,
} from '../';
import * as R from 'ramda';
import { AppMenuStateService, AuthStateService } from 'src/app/common/store';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Store} from '@ngrx/store';
import {loadAppMenu, selectCurrentUserLocale} from 'src/app/state';

@AutoUnsubscribe()
@Component({
    selector: 'app-navigation-menu-page',
    templateUrl: './navigation-menu-page.component.html',
    styleUrls: ['./navigation-menu-page.component.scss'],
    standalone: false
})
export class NavigationMenuPageComponent implements OnInit, OnDestroy {

  @ViewChild('resetMenuModal')
  resetMenuModal: NavigationMenuResetComponent;
  securityGroups: CommonDictionaryModel[] = [];
  navigationMenuModel: NavigationMenuModel = new NavigationMenuModel();

  navigationMenuSub$: Subscription;
  updateNavigationMenuSub$: Subscription;
  securityGroupsSub$: Subscription;
  resetSub$: Subscription;
  itemDeleteConfirmSub$: any;
  itemEditConfirmSub$: any;
  navigationMenuResetComponentAfterClosedSub$: Subscription;
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);

  get menuItemTypes() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    private authStore: Store,
    private dragulaService: DragulaService,
    private navigationMenuService: NavigationMenuService,
    private securityGroupsService: SecurityGroupsService,
    private authStateService: AuthStateService,
    private appMenuStateService: AppMenuStateService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private store: Store,
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
    this.dragulaService.drop('MENU_ITEMS').subscribe(({ name }) => {
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

  updateNavigationMenu() {
    this.updateNavigationMenuSub$ = this.navigationMenuService
      .updateNavigationMenu(this.navigationMenuModel.actualMenu)
      .subscribe(() => {
        this.store.dispatch(loadAppMenu());
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
    const modalId = this.dialog.open(NavigationMenuItemDeleteComponent,
      dialogConfigHelper(this.overlay, {model, firstLevelIndex, secondLevelIndex})).id;
    this.itemDeleteConfirmSub$ = this.dialog.getDialogById(modalId).componentInstance.itemDeleteConfirm
      .subscribe(x => this.onItemDeleteConfirm(x, modalId));
  }

  onItemEdit(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number | null
  ) {
    const modalId = this.dialog.open(NavigationMenuItemEditComponent,
      dialogConfigHelper(this.overlay, {model, firstLevelIndex, secondLevelIndex, securityGroups: this.securityGroups})).id;
    this.itemEditConfirmSub$ = this.dialog.getDialogById(modalId).componentInstance.itemEditConfirm
      .subscribe(x => this.onItemEditConfirm(x, modalId));
  }

  onItemEditConfirm(model: NavigationMenuItemIndexedModel, modalId: string) {
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
    this.dialog.getDialogById(modalId).close();
  }

  onItemDeleteConfirm(model: NavigationMenuItemIndexedModel, modalId: string) {
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
    this.dialog.getDialogById(modalId).close();
  }

  onResetMenuConfirm() {
    this.resetSub$ = this.navigationMenuService
      .restNavigationMenu()
      .subscribe((data) => {
        if (data && data.success) {
          this.store.dispatch(loadAppMenu());
          this.getNavigationMenu();
        }
      });
  }

  showResetNavigationMenuModal() {
    this.navigationMenuResetComponentAfterClosedSub$ = this.dialog.open(NavigationMenuResetComponent).afterClosed()
      .subscribe(x => x ? this.onResetMenuConfirm() : undefined);
  }

  getMenuTranslation(translations: NavigationMenuTranslationModel[]) {
    let language = '';
    this.selectCurrentUserLocale$.pipe(take(1)).subscribe((locale) => {
      language = locale;
    });
    return translations.find(
      (x) => x.localeName === language
    ).name;
  }

  menuItemModelChange($event: any[]) {
    this.navigationMenuModel.actualMenu = [...$event];
  }

  getSecurityGroupNames(ids: number[]): string[] {
    return ids.map(id => {
      const group = this.securityGroups.find(g => g.id === id);
      return group ? group.name : '';
    }).filter(name => name !== '');
  }

}
