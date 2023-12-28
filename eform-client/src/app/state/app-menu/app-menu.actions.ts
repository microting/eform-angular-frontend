import {createAction} from '@ngrx/store';
import {OperationDataResult, UserMenuModel} from 'src/app/common/models';

export const loadAppMenu = createAction(
  '[AppMenu] Load AppMenu'
);

export const loadAppMenuSuccess = createAction(
  '[AppMenu] Load AppMenu Success',
  (payload: OperationDataResult<UserMenuModel>) => ({payload})
);

export const loadAppMenuFailure = createAction(
  '[AppMenu] Load AppMenu Failure',
  (payload: any) => ({payload})
);
