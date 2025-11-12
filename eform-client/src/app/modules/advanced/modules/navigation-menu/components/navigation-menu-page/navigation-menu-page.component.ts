import { Component, OnDestroy, OnInit, ViewChild, inject, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, copyArrayItem, transferArrayItem, CdkDragMove, CdkDragRelease, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
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
  NavigationMenuDragDropService,
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
export class NavigationMenuPageComponent implements OnInit, OnDestroy, AfterViewInit {
  private authStore = inject(Store);
  private navigationMenuService = inject(NavigationMenuService);
  private securityGroupsService = inject(SecurityGroupsService);
  private authStateService = inject(AuthStateService);
  private appMenuStateService = inject(AppMenuStateService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private store = inject(Store);
  private dragDropService = inject(NavigationMenuDragDropService);
  private cdr = inject(ChangeDetectorRef);


  @ViewChild('resetMenuModal')
  resetMenuModal: NavigationMenuResetComponent;
  @ViewChildren(CdkDropList) dropLists?: QueryList<CdkDropList>;
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

  getDropdownId(index: number): string {
    return `dropdown-${index}`;
  }

  get connectedDropdownIds(): string[] {
    return this.navigationMenuModel.actualMenu
      .map((item, index) => item.type === NavigationMenuItemTypeEnum.Dropdown ? this.getDropdownId(index) : null)
      .filter(id => id !== null) as string[];
  }

  /**
   * Predicate function to determine if dropping is allowed
   */
  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return this.dragDropService.isDropAllowed(drag, drop);
  };

  /**
   * Get all connected drop lists from the service
   */
  get connectedLists(): CdkDropList[] {
    return this.dragDropService.dropLists;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.getNavigationMenu();
    this.getSecurityGroups();
  }

  ngAfterViewInit(): void {
    // Register all drop lists with the service after view initialization
    if (this.dropLists) {
      this.dropLists.forEach(dropList => {
        this.dragDropService.register(dropList);
      });

      // Subscribe to changes in drop lists (for dynamically added dropdowns)
      this.dropLists.changes.subscribe(() => {
        // Clear and re-register all drop lists when the list changes
        this.dragDropService.dropLists = [];
        this.dropLists?.forEach(dropList => {
          this.dragDropService.register(dropList);
        });
        // Trigger change detection to prevent ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
      });
    }
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

  dropMenuItem(event: CdkDragDrop<NavigationMenuItemModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Copy from template menu
      const item = {
        ...event.previousContainer.data[event.previousIndex],
        type: NavigationMenuItemTypeEnum.Link,
        isInternalLink: true
      };
      this.navigationMenuModel.actualMenu.splice(event.currentIndex, 0, item);
    }
    this.navigationMenuModel.actualMenu = [...this.navigationMenuModel.actualMenu];
  }

  dropMenuItemChild(event: CdkDragDrop<NavigationMenuItemModel[]>, parentIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Copy from template menu
      const item = {
        ...event.previousContainer.data[event.previousIndex],
        type: NavigationMenuItemTypeEnum.Link,
        isInternalLink: true
      };
      this.navigationMenuModel.actualMenu[parentIndex].children.splice(event.currentIndex, 0, item);
    }
    this.navigationMenuModel.actualMenu = [...this.navigationMenuModel.actualMenu];
  }

  ngOnDestroy(): void {
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

  getSecurityGroupNames(ids: number[]): string[] {
    return ids.map(id => {
      const group = this.securityGroups.find(g => g.id === id);
      return group ? group.name : '';
    }).filter(name => name !== '');
  }

  /**
   * Handle drag move events to track hover state
   */
  onDragMoved(event: CdkDragMove<any>) {
    this.dragDropService.dragMoved(event);
  }

  /**
   * Handle drag release events to clear hover state
   */
  onDragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

}
