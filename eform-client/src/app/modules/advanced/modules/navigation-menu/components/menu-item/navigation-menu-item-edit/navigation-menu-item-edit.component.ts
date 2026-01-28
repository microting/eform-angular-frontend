import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { CommonDictionaryModel } from 'src/app/common/models';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { MatInput } from '@angular/material/input';
import { NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-menu-item-edit',
    templateUrl: './navigation-menu-item-edit.component.html',
    styleUrls: ['./navigation-menu-item-edit.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MatInput, NgIf, MatIcon, MatCheckbox, NgFor, MatDialogActions, TranslatePipe]
})
export class NavigationMenuItemEditComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuItemEditComponent>>(MatDialogRef);

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

  constructor() {
    const model = inject<{
    model: NavigationMenuItemModel;
    firstLevelIndex: number;
    secondLevelIndex?: number;
    securityGroups: [
    ];
}>(MAT_DIALOG_DATA);

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
