import {createReducer, on} from '@ngrx/store';
import {loadAppMenu, loadAppMenuFailure, loadAppMenuSuccess} from 'src/app/state/app-menu/app-menu.actions';
import {MenuItemModel} from 'src/app/common/models';

export interface AppMenuState {
  leftMenu: MenuItemModel[];
  rightMenu: MenuItemModel[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: AppMenuState = {
  leftMenu: [],
  rightMenu: [{ menuItems: [], e2EId: '', isInternalLink: false, link: '', name: '', position: 0, guards: [] }],
  error: null,
  status: 'pending',
}

export const _appMenuReducer = createReducer(
  initialState,
  on(loadAppMenu, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(loadAppMenuSuccess, (state, {payload}) => ({
    ...state,
    leftMenu: payload.model.leftMenu,
    rightMenu: payload.model.rightMenu,
    status: 'success',
    })),
  on(loadAppMenuFailure, (state, {payload}) => ({
    ...state,
    error: payload,
    status: 'error',
    }))
);

export function reducer(state: AppMenuState | undefined, action: any) {
  return _appMenuReducer(state, action);
}
