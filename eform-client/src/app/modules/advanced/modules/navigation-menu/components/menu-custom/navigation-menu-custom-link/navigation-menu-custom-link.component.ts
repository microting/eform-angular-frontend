import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  NavigationMenuItemTypeEnum,
  applicationLanguagesTranslated,
} from 'src/app/common/const';
import {CommonDictionaryModel, NavigationMenuItemModel,} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-navigation-menu-custom-link',
    templateUrl: './navigation-menu-custom-link.component.html',
    styleUrls: ['./navigation-menu-custom-link.component.scss'],
    standalone: false
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  customLinkModel: NavigationMenuItemModel = new NavigationMenuItemModel();

  constructor(
    public dialogRef: MatDialogRef<NavigationMenuCustomLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public availableSecurityGroups: CommonDictionaryModel[] = []) {}

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
