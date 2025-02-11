import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { CommonDictionaryModel } from 'src/app/common/models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-navigation-menu-item-edit',
    templateUrl: './navigation-menu-item-edit.component.html',
    styleUrls: ['./navigation-menu-item-edit.component.scss'],
    standalone: false
})
export class NavigationMenuItemEditComponent implements OnInit {
  availableSecurityGroups: CommonDictionaryModel[] = [];
  itemEditConfirm: EventEmitter<
    NavigationMenuItemIndexedModel
  > = new EventEmitter<NavigationMenuItemIndexedModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();
  firstLevelIndex: number;
  secondLevelIndex: number | null;
  translationsArray: FormArray = new FormArray([]);

  get menuItemType() {
    return NavigationMenuItemTypeEnum;
  }

  constructor(
    public dialogRef: MatDialogRef<NavigationMenuItemEditComponent>,
    @Inject(MAT_DIALOG_DATA) model:
      {model: NavigationMenuItemModel, firstLevelIndex: number, secondLevelIndex?: number, securityGroups: []}) {
    this.availableSecurityGroups = model.securityGroups;
    this.item = model.model;
    this.translationsArray.clear();
    for (const translation of model.model.translations) {
      this.translationsArray.push(
        new FormGroup({
          id: new FormControl(translation.id),
          name: new FormControl(translation.name),
          localeName: new FormControl(translation.localeName),
          language: new FormControl(translation.language),
        })
      );
    }
    this.firstLevelIndex = model.firstLevelIndex;
    this.secondLevelIndex = model.secondLevelIndex;
  }

  ngOnInit(): void {}

  updateItem() {
    this.itemEditConfirm.emit({
      item: {
        ...this.item,
        translations: this.translationsArray.getRawValue(),
      },
      firstLevelIndex: this.firstLevelIndex,
      secondLevelIndex: this.secondLevelIndex,
    });
  }

  hide() {
    this.dialogRef.close();
  }
}
