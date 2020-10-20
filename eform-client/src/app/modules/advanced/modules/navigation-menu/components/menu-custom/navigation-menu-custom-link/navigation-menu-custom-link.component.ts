import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-custom-link',
  templateUrl: './navigation-menu-custom-link.component.html',
  styleUrls: ['./navigation-menu-custom-link.component.scss'],
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  @ViewChild('collapse') collapse: any;
  @Output() addLinkToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  collapsed = true;
  customLinkModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  constructor() {}

  ngOnInit(): void {}

  addToMenu() {
    this.addLinkToMenu.emit({ ...this.customLinkModel });
    this.customLinkModel = new NavigationMenuItemModel();
    this.collapsed = true;
    this.collapse.toggle();
  }
}
