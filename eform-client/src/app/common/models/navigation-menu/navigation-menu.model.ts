import {NavigationMenuItemTypeEnum} from 'src/app/common/const';

export class NavigationMenuModel {
  menuTemplates: NavigationMenuTemplateModel[];
  actualMenu: NavigationMenuItemModel[];
}

export class NavigationMenuTemplateModel {
  id: number;
  name: string;
  pluginId: number | null;
  collapsed: boolean;
  items: NavigationMenuTemplateItemModel[];
}

export class NavigationMenuTemplateItemModel {
  id: number;
  name: string;
  link: string;
  collapsed: boolean;
  translations: NavigationMenuTranslationModel[];
}

export class NavigationMenuItemModel {
  id: number;
  name: string;
  type: NavigationMenuItemTypeEnum;
  collapsed: boolean;
  link: string | null;
  children: NavigationMenuItemModel[] | null;
  relatedPluginId: number | null;
  relatedTemplateItemId: number | null;
  parentId: number | null;
  position: number;
  isVirtual: boolean;
  translations: NavigationMenuTranslationModel[];
}

export class NavigationMenuTranslationModel {
  id: number;
  languageName: string;
  locale: string;
  translationString: string;
}
