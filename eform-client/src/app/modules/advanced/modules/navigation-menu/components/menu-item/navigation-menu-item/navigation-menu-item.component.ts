import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';
import {NavigationMenuItemDeleteComponent} from '../navigation-menu-item-delete/navigation-menu-item-delete.component';

@Component({
  selector: 'app-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss']
})
export class NavigationMenuItemComponent implements OnInit {
  @ViewChild('menuItemDeleteModal') menuItemDeleteModal: NavigationMenuItemDeleteComponent;
  @Input() item: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() itemIndex = 0;
  @Output() itemDelete: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  constructor() { }

  ngOnInit(): void {
  }

  showRemoveModal() {

  }

  onItemDelete(model: NavigationMenuItemModel) {
    this.itemDelete.emit(model);
  }
}
