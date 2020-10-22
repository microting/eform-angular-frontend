import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';
import {NavigationMenuItemTypeEnum} from 'src/app/common/const';

@Component({
  selector: 'app-navigation-menu-item-edit',
  templateUrl: './navigation-menu-item-edit.component.html',
  styleUrls: ['./navigation-menu-item-edit.component.scss']
})
export class NavigationMenuItemEditComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() itemUpdate: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
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
    this.itemUpdate.emit(this.item);
  }

  cancelDelete() {
    this.frame.hide();
    this.item = new NavigationMenuItemModel();
  }
}
