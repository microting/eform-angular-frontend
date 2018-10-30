export class UserMenuModel {
  leftMenu: Array<MenuItemModel> = [];
  rightMenu: Array<MenuItemModel> = [];
}

export class MenuItemModel {
  name: string;
  link: string;
  e2eId: string;
  position: number;

  menuItems: Array<MenuItemModel> = [];
}
