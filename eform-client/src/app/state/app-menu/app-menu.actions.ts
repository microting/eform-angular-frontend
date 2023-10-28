import {createAction} from '@ngrx/store';

export const loadAppMenu = createAction(
  '[AppMenu] Load AppMenu'
);

export const loadAppMenuSuccess = createAction(
  '[AppMenu] Load AppMenu Success',
  (payload: any) => ({payload})
);

export const loadAppMenuFailure = createAction(
  '[AppMenu] Load AppMenu Failure',
  (payload: any) => ({payload})
);
