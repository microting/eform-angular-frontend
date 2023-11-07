import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {Action, createReducer, on} from '@ngrx/store';
import {
  updateSecurityFilters,
  updateSecurityPagination,
  updateSecurityTotal
} from "src/app/state/security/security.actions";

export interface SecurityState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
}

export const initialState: SecurityState = {
  pagination: {
    offset: 0,
    pageSize: 10000,
    pageIndex: 0,
    sort: 'Id',
    isSortDsc: false,
    total: 0,
  },
  filters: {
    nameFilter: '',
    tagIds: [],
  },
}

export const _securityReducer = createReducer(
  initialState,
  on(updateSecurityFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    },
    })),
  on(updateSecurityPagination, (state, {payload}) => ({
    ...state,
    pagination: {
      pageSize: payload.pagination.pageSize,
      pageIndex: payload.pagination.pageIndex,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      offset: payload.pagination.offset,
      total: payload.pagination.total,
    },
    }),
  ),
  on(updateSecurityTotal, (state, {payload}) => ({
    ...state,
    pagination: {
      ...state.pagination,
      total: payload.total,
    },
    }),
  ),
);

export function reducer(state: SecurityState | undefined, action: any) {
  return _securityReducer(state, action);
}
