import {createReducer, on} from '@ngrx/store';
import {loadAppMenu, loadAppMenuFailure, loadAppMenuSuccess} from './';
import {MenuItemModel} from 'src/app/common/models';
import {StoreStatusEnum} from 'src/app/common/const';

export interface AppMenuState {
  leftMenu: MenuItemModel[];
  rightMenu: MenuItemModel[];
  error: string;
  status: StoreStatusEnum;
}

export const appMenuInitialState: AppMenuState = {
  leftMenu: [],
  rightMenu: [{menuItems: [], e2EId: '', isInternalLink: false, link: '', name: '', position: 0, guards: []}],
  error: null,
  status: StoreStatusEnum.Pending,
};

export const _appMenuReducer = createReducer(
  appMenuInitialState,
  on(loadAppMenu, (state) => ({
    ...state,
    status: StoreStatusEnum.Loading,
  })),
  on(loadAppMenuSuccess, (state, {payload}) => ({
    ...state,
    leftMenu: payload.model.leftMenu,
    rightMenu: payload.model.rightMenu,
    status: StoreStatusEnum.Success,
  })),
  on(loadAppMenuFailure, (state, {payload}) => ({
    ...state,
    error: payload,
    status: StoreStatusEnum.Error,
  }))
);

export function appMenuReducer(state: AppMenuState | undefined, action: any) {
  return _appMenuReducer(state, action);
}
