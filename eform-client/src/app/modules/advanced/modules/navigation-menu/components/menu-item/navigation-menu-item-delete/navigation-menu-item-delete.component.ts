import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';

@Component({
  selector: 'app-navigation-menu-item-delete',
  templateUrl: './navigation-menu-item-delete.component.html',
  styleUrls: ['./navigation-menu-item-delete.component.scss'],
})
export class NavigationMenuItemDeleteComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() itemDeleteConfirm: EventEmitter<
    NavigationMenuItemIndexedModel
  > = new EventEmitter<NavigationMenuItemIndexedModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();
  firstLevelIndex: number;
  secondLevelIndex: number;

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor() {}

  ngOnInit(): void {}

  show(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number
  ) {
    this.item = model;
    this.firstLevelIndex = firstLevelIndex;
    this.secondLevelIndex = secondLevelIndex;
    this.frame.show();
  }

  deleteMenuItem() {
    this.itemDeleteConfirm.emit({
      item: this.item,
      firstLevelIndex: this.firstLevelIndex,
      secondLevelIndex: this.secondLevelIndex,
    });
    this.frame.hide();
  }

  cancelDelete() {
    this.frame.hide();
    this.item = new NavigationMenuItemModel();
  }
}
