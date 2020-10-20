import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-custom',
  templateUrl: './navigation-menu-custom.component.html',
  styleUrls: ['./navigation-menu-custom.component.scss']
})
export class NavigationMenuCustomComponent implements OnInit {
  collapsed = false;
  @Output() addCustomLinkToMenu: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  @Output() addCustomDropdownToMenu: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddLinkToMenu(model: NavigationMenuItemModel) {
    this.addCustomLinkToMenu.emit(model);
  }

  onAddDropdownToMenu(model: NavigationMenuItemModel) {
    this.addCustomDropdownToMenu.emit(model);
  }
}
