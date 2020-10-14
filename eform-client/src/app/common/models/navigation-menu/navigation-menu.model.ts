export class NavigationMenuModel {
  menuTemplates: NavigationMenuTemplateModel[];
  actualMenu: NavigationMenuItemModel[];
}

export class NavigationMenuTemplateModel {
  id: number;
  name: string;
  pluginId: number | null;
  child: { id: number; name: string; link: string }[];
}

export class NavigationMenuItemModel {
  id: number;
  name: string;
  isDropdown: boolean;
  link: string;
  children: NavigationMenuItemModel[] | null;
  position: number;
}
