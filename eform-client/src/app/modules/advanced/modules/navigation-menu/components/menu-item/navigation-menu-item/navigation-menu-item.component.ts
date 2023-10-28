import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  NavigationMenuItemModel,
  NavigationMenuTranslationModel,
} from 'src/app/common/models/navigation-menu';
import {take} from 'rxjs';
import {selectCurrentUserLocale} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

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
  private selectCurrentUserLocale$ = this.authStore.select(selectCurrentUserLocale);
  constructor(
    private authStore: Store
  ) {}

  ngOnInit(): void {}

  delete() {
    this.itemDelete.emit(this.item);
  }

  edit() {
    this.itemEdit.emit(this.item);
  }

  getMenuTranslation(translations: NavigationMenuTranslationModel[]) {
    let language = '';
    this.selectCurrentUserLocale$.pipe(take(1)).subscribe((locale) => {
      language = locale;
    });
    return translations.find(
      (x) => x.localeName === language
    ).name;
    // return translations.find(
    //   (x) => x.localeName === this.authStateService.currentUserLocale
    // ).name;
  }
}
