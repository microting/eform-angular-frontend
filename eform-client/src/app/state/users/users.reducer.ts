import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {loadUsers, updateUsersPagination} from "src/app/state/users/users.actions";
import {updateCasesPagination} from "src/app/state/cases/cases.actions";

export interface UsersState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: UsersState = {
  pagination: {
    sort: 'Id',
    isSortDsc: false,
    pageIndex: 0,
    pageSize: 10,
    offset: 0,
    total: 0,
  },
  filters: {
    nameFilter: '',
    tagIds: [],
  },
  total: 0,
}

export const usersReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({
    ...state,
    })),
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
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
