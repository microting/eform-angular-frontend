import {createSelector} from '@ngrx/store';
import {AppMenuState} from 'src/app/state/app-menu/app-menu.reducer';
import {AppState} from 'src/app/state/app.state';

export const selectAppMenus = (state: AppState) => state.appMenus;
export const rightAppMenus = createSelector(
  selectAppMenus,
  (state: AppMenuState) => state?.rightMenu[0].menuItems
);

export const leftAppMenus = createSelector(
  selectAppMenus,
  (state: AppMenuState) => state?.leftMenu
);
