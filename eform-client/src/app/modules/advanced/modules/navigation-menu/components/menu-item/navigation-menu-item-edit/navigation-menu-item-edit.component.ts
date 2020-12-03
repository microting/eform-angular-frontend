import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { CommonDictionaryModel } from 'src/app/common/models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navigation-menu-item-edit',
  templateUrl: './navigation-menu-item-edit.component.html',
  styleUrls: ['./navigation-menu-item-edit.component.scss'],
})
export class NavigationMenuItemEditComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Input() availableSecurityGroups: CommonDictionaryModel[] = [];
  @Output() itemEditConfirm: EventEmitter<
    NavigationMenuItemIndexedModel
  > = new EventEmitter<NavigationMenuItemIndexedModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();
  firstLevelIndex: number;
  secondLevelIndex: number | null;
  translationsArray: FormArray = new FormArray([]);

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor() {}

  ngOnInit(): void {}

  show(
    model: NavigationMenuItemModel,
    firstLevelIndex: number,
    secondLevelIndex?: number
  ) {
    this.item = model;
    this.translationsArray.clear();
    for (const translation of model.translations) {
      this.translationsArray.push(
        new FormGroup({
          id: new FormControl(translation.id),
          name: new FormControl(translation.name),
          localeName: new FormControl(translation.localeName),
          language: new FormControl(translation.language),
        })
      );
    }
    this.firstLevelIndex = firstLevelIndex;
    this.secondLevelIndex = secondLevelIndex;
    this.frame.show();
  }

  updateItem() {
    this.itemEditConfirm.emit({
      item: {
        ...this.item,
        translations: this.translationsArray.getRawValue(),
      },
      firstLevelIndex: this.firstLevelIndex,
      secondLevelIndex: this.secondLevelIndex,
    });
    this.frame.hide();
  }

  cancelUpdate() {
    this.frame.hide();
    this.item = new NavigationMenuItemModel();
  }

  hide() {
    this.frame.hide();
  }
}
