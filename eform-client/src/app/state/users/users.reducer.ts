import {CommonPaginationState} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {updateUsersPagination, updateUsersTotal} from './';

export interface UsersState {
  pagination: CommonPaginationState;
  total: number;
}

export const usersInitialState: UsersState = {
  pagination: {
    sort: 'Id',
    isSortDsc: false,
    pageIndex: 0,
    pageSize: 100,
    offset: 0,
    total: 0,
  },
  total: 0,
};

const _usersReducer = createReducer(
  usersInitialState,
  on(updateUsersPagination, (state, {payload}) => ({
    ...state,
    pagination: {
      offset: payload.pagination.offset,
      pageSize: payload.pagination.pageSize,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      pageIndex: payload.pagination.pageIndex,
      total: payload.pagination.total,
    },
  })),
  on(updateUsersTotal, (state, {payload}) => ({
    ...state,
    total: payload.total,
    pagination: {
      ...state.pagination,
      total: payload.total,
    },
  })),
);

export function usersReducer(state: UsersState | undefined, action: Action) {
  return _usersReducer(state, action);
}
