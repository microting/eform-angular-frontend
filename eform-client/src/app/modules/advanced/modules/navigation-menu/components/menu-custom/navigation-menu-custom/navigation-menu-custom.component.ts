import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';
import { NavigationMenuCustomDropdownComponent, NavigationMenuCustomLinkComponent}
  from '..';
import { CommonDictionaryModel } from 'src/app/common/models';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-navigation-menu-custom',
    templateUrl: './navigation-menu-custom.component.html',
    styleUrls: ['./navigation-menu-custom.component.scss'],
    standalone: false
})
export class NavigationMenuCustomComponent implements OnInit {
  dialog = inject(MatDialog);
  private overlay = inject(Overlay);

  @Input() availableSecurityGroups: CommonDictionaryModel[] = [];
  @Output() addCustomLinkToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  @Output() addCustomDropdownToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  collapsed = false;
  navigationMenuCustomDropdownComponentAfterClosedSub$: Subscription;

  ngOnInit(): void {}

  showDropdownAddModal() {
    this.navigationMenuCustomDropdownComponentAfterClosedSub$ = this.dialog.open(NavigationMenuCustomDropdownComponent, {
      ...dialogConfigHelper(this.overlay, this.availableSecurityGroups),
      minWidth: 400,
    }).afterClosed().subscribe(data => data.result ? this.onAddDropdownToMenu(data.navigationMenuItem) : undefined);
  }

  onAddLinkToMenu(model: NavigationMenuItemModel) {
    this.addCustomLinkToMenu.emit(model);
  }

  onAddDropdownToMenu(model: NavigationMenuItemModel) {
    this.addCustomDropdownToMenu.emit(model);
  }

  showCustomLinkAddModal() {
    this.navigationMenuCustomDropdownComponentAfterClosedSub$ = this.dialog.open(NavigationMenuCustomLinkComponent, {
      ...dialogConfigHelper(this.overlay, this.availableSecurityGroups),
      minWidth: 400,
    }).afterClosed().subscribe(data => data.result ? this.onAddLinkToMenu(data.link) : undefined);
  }
}
