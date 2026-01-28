import { Component, OnInit, inject } from '@angular/core';
import {
  NavigationMenuItemTypeEnum,
  applicationLanguagesTranslated,
} from 'src/app/common/const';
import {CommonDictionaryModel, NavigationMenuItemModel,} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgFor } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-navigation-menu-custom-link',
    templateUrl: './navigation-menu-custom-link.component.html',
    styleUrls: ['./navigation-menu-custom-link.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, MatInput, MatCheckbox, NgFor, MatDialogActions, TranslatePipe]
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuCustomLinkComponent>>(MatDialogRef);
  availableSecurityGroups = inject(MAT_DIALOG_DATA) ?? [];

  customLinkModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  ngOnInit(): void {
    this.customLinkModel = this.generateLanguages(new NavigationMenuItemModel());}

  addCustomLink() {
    const link = {
      ...this.customLinkModel,
      id: Math.floor(Math.random() * 1000),
      type: NavigationMenuItemTypeEnum.CustomLink,
      isVirtual: true,
      name: 'Custom link'
    };
    this.hide(true, link);
  }

  hide(result = false, link?: NavigationMenuItemModel) {
    this.dialogRef.close({result: result, link: result ? link : null});
  }

  generateLanguages(model: NavigationMenuItemModel) {
    model = {
      ...model,
      translations: applicationLanguagesTranslated.map((x) => {
        return { id: x.id, localeName: x.locale, name: '', language: x.text };
      }),
    };
    return model;
  }
}
