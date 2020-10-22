import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';
import {NavigationMenuCustomDropdownComponent} from '../navigation-menu-custom-dropdown/navigation-menu-custom-dropdown.component';
import {NavigationMenuCustomLinkComponent} from '../navigation-menu-custom-link/navigation-menu-custom-link.component';

@Component({
  selector: 'app-navigation-menu-custom',
  templateUrl: './navigation-menu-custom.component.html',
  styleUrls: ['./navigation-menu-custom.component.scss']
})
export class NavigationMenuCustomComponent implements OnInit {
  collapsed = false;
  @ViewChild('customDropdownModal') customDropdownModal: NavigationMenuCustomDropdownComponent;
  @ViewChild('customLinkModal') customLinkModal: NavigationMenuCustomLinkComponent;
  @Output() addCustomLinkToMenu: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  @Output() addCustomDropdownToMenu: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();

  constructor() { }

  ngOnInit(): void {
  }

  showDropdownAddModal() {
    this.customDropdownModal.show();
  }

  onAddLinkToMenu(model: NavigationMenuItemModel) {
    this.addCustomLinkToMenu.emit(model);
  }

  onAddDropdownToMenu(model: NavigationMenuItemModel) {
    this.addCustomDropdownToMenu.emit(model);
  }

  showCustomLinkAddModal() {
    this.customLinkModal.show();
  }
}
