import {
  Component,
  EventEmitter, Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NavigationMenuItemModel } from 'src/app/common/models/navigation-menu';
import { NavigationMenuItemTypeEnum } from 'src/app/common/const';
import { applicationLanguages } from 'src/app/common/const/application-languages.const';
import {CommonDictionaryModel} from 'src/app/common/models';

@Component({
  selector: 'app-navigation-menu-custom-dropdown',
  templateUrl: './navigation-menu-custom-dropdown.component.html',
  styleUrls: ['./navigation-menu-custom-dropdown.component.scss'],
})
export class NavigationMenuCustomDropdownComponent implements OnInit {
  @ViewChild('frame', { static: true }) frame;
  @Output() addDropdownToMenu: EventEmitter<
    NavigationMenuItemModel
  > = new EventEmitter<NavigationMenuItemModel>();
  customDropdownModel: NavigationMenuItemModel = new NavigationMenuItemModel();
  @Input() availableSecurityGroups: CommonDictionaryModel[] = [
    {
      id: 1,
      name: 'Test',
      description: ''
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.customDropdownModel = this.generateLanguages(this.customDropdownModel);
    this.frame.show();
  }

  addCustomDropdown() {
    this.addDropdownToMenu.emit({
      ...this.customDropdownModel,
      id: Math.floor(Math.random() * 1000),
      type: NavigationMenuItemTypeEnum.Dropdown,
      isVirtual: true,
      children: [],
      name: 'Dropdown',
    });
    this.hide();
  }

  hide() {
    this.frame.hide();
    this.customDropdownModel = this.generateLanguages(
      new NavigationMenuItemModel()
    );
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
