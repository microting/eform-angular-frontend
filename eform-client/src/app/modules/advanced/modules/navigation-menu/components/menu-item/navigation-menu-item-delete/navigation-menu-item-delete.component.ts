import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
} from 'src/app/common/models';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-navigation-menu-item-delete',
    templateUrl: './navigation-menu-item-delete.component.html',
    styleUrls: ['./navigation-menu-item-delete.component.scss'],
    standalone: false
})
export class NavigationMenuItemDeleteComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuItemDeleteComponent>>(MatDialogRef);

  itemDeleteConfirm: EventEmitter<
    NavigationMenuItemIndexedModel
  > = new EventEmitter<NavigationMenuItemIndexedModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();
  firstLevelIndex: number;
  secondLevelIndex: number;

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor() {
    const model = inject<{
    model: NavigationMenuItemModel;
    firstLevelIndex: number;
    secondLevelIndex?: number;
}>(MAT_DIALOG_DATA);

    this.item = model.model;
    this.firstLevelIndex = model.firstLevelIndex;
    this.secondLevelIndex = model.secondLevelIndex;
  }

  ngOnInit(): void {}

  deleteMenuItem() {
    this.itemDeleteConfirm.emit({
      item: this.item,
      firstLevelIndex: this.firstLevelIndex,
      secondLevelIndex: this.secondLevelIndex,
    });
  }

  hide() {
    this.dialogRef.close();
  }
}
