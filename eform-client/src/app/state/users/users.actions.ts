import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';

export const updateUsersPagination = createAction(
  '[Users] Update Users Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const updateUsersTotal = createAction(
  '[Users] Update Users Total',
  (payload: { total: number }) => ({payload})
);
