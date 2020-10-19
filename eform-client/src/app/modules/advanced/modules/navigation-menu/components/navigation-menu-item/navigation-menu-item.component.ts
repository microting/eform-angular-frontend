import {Component, Input, OnInit} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss']
})
export class NavigationMenuItemComponent implements OnInit {
  @Input() item: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() itemIndex = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
