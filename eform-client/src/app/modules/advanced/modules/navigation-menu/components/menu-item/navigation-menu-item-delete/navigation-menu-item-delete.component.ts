import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';

@Component({
  selector: 'app-navigation-menu-item-delete',
  templateUrl: './navigation-menu-item-delete.component.html',
  styleUrls: ['./navigation-menu-item-delete.component.scss'],
})
export class NavigationMenuItemDeleteComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() itemDelete: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor() {}

  ngOnInit(): void {}

  show(model: NavigationMenuItemModel) {
    this.item = model;
    this.frame.show();
  }

  deleteMenuItem() {
    this.itemDelete.emit(this.item);
  }

  cancelDelete() {
    this.frame.hide();
    this.item = new NavigationMenuItemModel();
  }
}
