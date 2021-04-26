import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NavigationMenuItemModel,
  NavigationMenuTranslationModel,
} from 'src/app/common/models/navigation-menu';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-navigation-menu-item',
  templateUrl: './navigation-menu-item.component.html',
  styleUrls: ['./navigation-menu-item.component.scss'],
})
export class NavigationMenuItemComponent implements OnInit {
  @Input() item: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() firstLevelIndex: number;
  @Input() secondLevelIndex: number | null;
  @Output()
  itemDelete: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  @Output()
  itemEdit: EventEmitter<NavigationMenuItemModel> = new EventEmitter<NavigationMenuItemModel>();
  constructor(private authStateService: AuthStateService) {}

  ngOnInit(): void {}

  delete() {
    this.itemDelete.emit(this.item);
  }

  edit() {
    this.itemEdit.emit(this.item);
  }

  getMenuTranslation(translations: NavigationMenuTranslationModel[]) {
    return translations.find(
      (x) => x.localeName === this.authStateService.currentUserLocale
    ).name;
  }
}
