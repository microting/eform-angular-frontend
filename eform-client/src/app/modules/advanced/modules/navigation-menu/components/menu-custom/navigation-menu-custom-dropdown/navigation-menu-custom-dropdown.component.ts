import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';

@Component({
  selector: 'app-navigation-menu-custom-dropdown',
  templateUrl: './navigation-menu-custom-dropdown.component.html',
  styleUrls: ['./navigation-menu-custom-dropdown.component.scss'],
})
export class NavigationMenuCustomDropdownComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() addDropdownToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  customDropdownModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.frame.show();
  }

  addCustomDropdown() {
    this.addDropdownToMenu.emit({
      ...this.customDropdownModel,
      id: Math.floor(Math.random() * 1000),
      type: NavigationMenuItemTypeEnum.Dropdown,
      isVirtual: true,
      children: [],
    });
    this.customDropdownModel = new NavigationMenuItemModel();
  }

  cancelAddCustomDropdown() {
    this.frame.hide();
    this.customDropdownModel = new NavigationMenuItemModel();
  }
}
