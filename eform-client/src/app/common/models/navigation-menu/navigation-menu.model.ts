import {NavigationMenuItemTypeEnum} from 'src/app/common/const';

export class NavigationMenuModel {
  menuTemplates: NavigationMenuTemplateModel[] = [];
  actualMenu: NavigationMenuItemModel[] = [];
}

export class NavigationMenuTemplateModel {
  id: number;
  name: string;
  collapsed: boolean;
  items: NavigationMenuTemplateItemModel[];
}

export class NavigationMenuTemplateItemModel {
  id: number;
  name: string;
  link: string;
  collapsed: boolean;
  translations: NavigationMenuTranslationModel[];
  icon?: string;
}

export class NavigationMenuItemModel {
  id: number;
  name: string;
  type: NavigationMenuItemTypeEnum;
  collapsed: boolean;
  link: string | null;
  children: NavigationMenuItemModel[] | null;
  relatedTemplateItemId: number | null;
  parentId: number | null;
  position: number;
  isVirtual: boolean;
  securityGroupsIds: number[];
  translations: NavigationMenuTranslationModel[];
  isInternalLink: boolean = true;
  icon?: string;
}

export class NavigationMenuTranslationModel {
  id: number;
  name: string;
  localeName: string;
  language: string;
}

export class NavigationMenuItemIndexedModel {
  firstLevelIndex: number;
  secondLevelIndex: number | null;
  item: NavigationMenuItemModel;
}
