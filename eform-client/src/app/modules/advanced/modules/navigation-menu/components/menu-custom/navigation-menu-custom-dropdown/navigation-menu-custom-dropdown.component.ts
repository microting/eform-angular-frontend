import { Component, OnInit, inject } from '@angular/core';

import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { applicationLanguages } from 'src/app/common/const/application-languages.const';
import {CommonDictionaryModel, NavigationMenuItemModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-navigation-menu-custom-dropdown',
    templateUrl: './navigation-menu-custom-dropdown.component.html',
    styleUrls: ['./navigation-menu-custom-dropdown.component.scss'],
    standalone: false
})
export class NavigationMenuCustomDropdownComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuCustomDropdownComponent>>(MatDialogRef);
  availableSecurityGroups = inject(MAT_DIALOG_DATA) ?? [
    {
        id: 1,
        name: 'Test',
        description: ''
    },
];

  customDropdownModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  ngOnInit(): void {
    this.customDropdownModel = this.generateLanguages(this.customDropdownModel);
  }

  hide(result = false) {
    this.dialogRef.close({result: result,
      navigationMenuItem: {
        ...this.customDropdownModel,
        id: Math.floor(Math.random() * 1000),
        type: NavigationMenuItemTypeEnum.Dropdown,
        isVirtual: true,
        children: [],
        name: 'Dropdown',
      }
    });
  }

  generateLanguages(model: NavigationMenuItemModel) {
    model = {
      ...model,
      translations: applicationLanguages.map((x) => {
        return { id: x.id, localeName: x.locale, name: '', language: x.text };
      }),
    };
    return model;
  }
}
