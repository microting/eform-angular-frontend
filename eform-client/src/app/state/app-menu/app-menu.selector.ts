import {createSelector} from '@ngrx/store';
import {AppMenuState, AppState} from '../';

export const selectAppMenus = (state: AppState) => state.appMenus;
export const rightAppMenus = createSelector(
  selectAppMenus,
  (state: AppMenuState) => state?.rightMenu[0].menuItems
);

export const leftAppMenus = createSelector(
  selectAppMenus,
  (state: AppMenuState) => state?.leftMenu
);
