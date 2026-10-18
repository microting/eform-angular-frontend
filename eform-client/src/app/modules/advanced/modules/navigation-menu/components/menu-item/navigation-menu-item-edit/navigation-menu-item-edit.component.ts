import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  NavigationMenuItemIndexedModel,
  NavigationMenuItemModel,
  NavigationMenuTemplateItemModel,
  NavigationMenuTemplateModel,
} from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { CommonDictionaryModel } from 'src/app/common/models';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { MatInput } from '@angular/material/input';
import { NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import {MenuLinkRouteService} from '../../../menu-link-route.service';

@Component({
    selector: 'app-navigation-menu-item-edit',
    templateUrl: './navigation-menu-item-edit.component.html',
    styleUrls: ['./navigation-menu-item-edit.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatHint, MtxSelect, ReactiveFormsModule, FormsModule, MatInput, NgIf, MatIcon, MatCheckbox, MatTooltip, NgFor, MatDialogActions, TranslatePipe]
})
export class NavigationMenuItemEditComponent implements OnInit {
  dialogRef = inject<MatDialogRef<NavigationMenuItemEditComponent>>(MatDialogRef);
  private menuLinkRouteService = inject(MenuLinkRouteService);

  availableSecurityGroups: CommonDictionaryModel[] = [];
  itemEditConfirm: EventEmitter<
    NavigationMenuItemIndexedModel
  > = new EventEmitter<NavigationMenuItemIndexedModel>();
  item: NavigationMenuItemModel = new NavigationMenuItemModel();
  firstLevelIndex: number;
  secondLevelIndex: number | null;
  translationsArray: FormArray = new FormArray([]);
  menuTemplates: NavigationMenuTemplateModel[] = [];
  /** The plugin template item this entry came from, if any: its link is the default. */
  defaultLinkItem: NavigationMenuTemplateItemModel | null = null;

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
    menuTemplates?: NavigationMenuTemplateModel[];
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
    this.menuTemplates = model.menuTemplates ?? [];
    this.defaultLinkItem = this.menuLinkRouteService.pluginTemplateItem(this.item, this.menuTemplates);
  }

  get linkHasNoRoute(): boolean {
    return this.menuLinkRouteService.hasNoRoute(this.item, this.menuTemplates);
  }

  restoreDefaultLink() {
    this.item.link = this.defaultLinkItem.link;
    this.item.isInternalLink = true;
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
