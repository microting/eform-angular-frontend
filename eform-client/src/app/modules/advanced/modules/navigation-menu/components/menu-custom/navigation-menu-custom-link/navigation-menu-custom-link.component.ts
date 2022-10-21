import {
  Component,
  EventEmitter, Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';
import {
  NavigationMenuItemTypeEnum,
  applicationLanguages,
  applicationLanguages2,
  applicationLanguagesTranslated
} from 'src/app/common/const';
import {CommonDictionaryModel} from 'src/app/common/models';

@Component({
  selector: 'app-navigation-menu-custom-link',
  templateUrl: './navigation-menu-custom-link.component.html',
  styleUrls: ['./navigation-menu-custom-link.component.scss'],
})
export class NavigationMenuCustomLinkComponent implements OnInit {
  @Output() addLinkToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  customLinkModel: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() availableSecurityGroups: CommonDictionaryModel[] = [
    {
      id: 1,
      name: 'Test',
      description: ''
    },
  ];

  @ViewChild('frame', { static: true }) frame;

  constructor() {}

  ngOnInit(): void {}

  addCustomLink() {
    this.addLinkToMenu.emit({
      ...this.customLinkModel,
      id: Math.floor(Math.random() * 1000),
      type: NavigationMenuItemTypeEnum.CustomLink,
      isVirtual: true,
      name: 'Custom link'
    });
    this.hide();
  }

  show() {
    this.customLinkModel = this.generateLanguages(this.customLinkModel);
    this.frame.show();
  }

  hide() {
    this.frame.hide();
    this.customLinkModel = this.generateLanguages(new NavigationMenuItemModel());
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
