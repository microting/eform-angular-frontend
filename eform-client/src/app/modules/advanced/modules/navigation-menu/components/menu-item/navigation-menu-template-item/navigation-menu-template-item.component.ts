import {Component, Input, OnInit} from '@angular/core';
import {NavigationMenuTemplateItemModel} from 'src/app/common/models/navigation-menu';
import { MatCard, MatCardHeader } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-navigation-menu-template-item',
    templateUrl: './navigation-menu-template-item.component.html',
    styleUrls: ['./navigation-menu-template-item.component.scss'],
    imports: [MatCard, MatCardHeader, MatIcon]
})
export class NavigationMenuTemplateItemComponent implements OnInit {
  @Input() item: NavigationMenuTemplateItemModel = new NavigationMenuTemplateItemModel();
  @Input() itemIndex = 0;
  @Input() templateIndex = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
