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
  selector: 'app-navigation-menu-custom-link',
  templateUrl: './navigation-menu-custom-link.component.html',
  styleUrls: ['./navigation-menu-custom-link.component.scss'],
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  @Output() addLinkToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  customLinkModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  @ViewChild('frame', { static: true }) frame;

  constructor() {}

  ngOnInit(): void {}

  addCustomLink() {
    this.addLinkToMenu.emit({
      ...this.customLinkModel,
      id: Math.floor(Math.random() * 1000),
      type: NavigationMenuItemTypeEnum.Link,
      isVirtual: true,
    });
    this.customLinkModel = new NavigationMenuItemModel();
    this.frame.hide();
  }

  show() {
    this.frame.show();
  }

  cancelAddCustomLink() {
    this.frame.hide();
    this.customLinkModel = new NavigationMenuItemModel();
  }
}
