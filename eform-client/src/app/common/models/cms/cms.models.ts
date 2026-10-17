export interface CmsPublicConfigModel {
  isCmsEnabled: boolean;
  isMenuSticky: boolean;
  themeVariant?: 'eform' | 'workspace';
}

export interface CmsMenuItemModel {
  id?: number;
  parentId?: number;
  title: string;
  pageId?: number;
  pageSlug?: string;
  externalUrl?: string;
  target: string;
  order: number;
  children: CmsMenuItemModel[];
}

export interface CmsMenuItemSaveModel {
  id?: number;
  parentId?: number;
  title: string;
  pageId?: number;
  externalUrl?: string;
  target: string;
  order: number;
}

export interface CmsMenuModel {
  id?: number;
  name: string;
  items: CmsMenuItemModel[];
}

export interface CmsPublicLandingModel {
  title: string;
  body: string;
  menu?: CmsMenuModel;
}

export interface CmsPageModel {
  id?: number;
  title: string;
  body: string;
  slug: string;
  isLandingPage: boolean;
  isPublished: boolean;
}

export interface CmsPageListModel {
  id: number;
  title: string;
  slug: string;
  isLandingPage: boolean;
  isPublished: boolean;
  updatedAt?: string;
}

export interface CmsSettingsModel {
  isCmsEnabled: boolean;
  isMenuSticky: boolean;
  activeMenuId?: number;
}
