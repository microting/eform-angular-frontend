import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-custom-dropdown',
  templateUrl: './navigation-menu-custom-dropdown.component.html',
  styleUrls: ['./navigation-menu-custom-dropdown.component.scss']
})
export class NavigationMenuCustomDropdownComponent implements OnInit {
  @ViewChild('collapse') collapse: any;
  @Output() addDropdownToMenu: EventEmitter<
    NavigationMenuItemModel
    > = new EventEmitter<NavigationMenuItemModel>();
  collapsed = true;
  customDropdownModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  constructor() {}

  ngOnInit(): void {}

  addToMenu() {
    this.addDropdownToMenu.emit({ ...this.customDropdownModel, isDropdown: true, children: [] });
    this.customDropdownModel = new NavigationMenuItemModel();
    this.collapsed = true;
    this.collapse.toggle();
  }
}
