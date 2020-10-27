import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationMenuItemModel} from 'src/app/common/models/navigation-menu';

@Component({
  selector: 'app-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss']
})
export class NavigationMenuItemComponent implements OnInit {
  @Input() item: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() firstLevelIndex: number;
  @Input() secondLevelIndex: number | null;
  @Output() itemDelete: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  @Output() itemEdit: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  constructor() { }

  ngOnInit(): void {
  }

  delete() {
    this.itemDelete.emit(this.item);
  }

  edit() {
    this.itemEdit.emit(this.item);
  }
}
