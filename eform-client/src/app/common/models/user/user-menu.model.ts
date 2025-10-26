export class UserMenuModel {
  leftMenu: Array<MenuItemModel> = [];
  rightMenu: Array<MenuItemModel> = [];
}

export class MenuItemModel {
  name: string;
  link: string;
  e2EId: string;
  position: number;
  isInternalLink: boolean;
  menuItems: Array<MenuItemModel> = [];
  guards: Array<string> = [];
  icon?: string;
}
