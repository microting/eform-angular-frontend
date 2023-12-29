import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  updateSecurityFilters,
  updateSecurityPagination,
  updateSecurityTotal
} from './';

export interface SecurityState {
  pagination: CommonPaginationState;
  filters: SecurityFilters;
}

export interface SecurityFilters {
  nameFilter: string;
}

export const securityInitialState: SecurityState = {
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
  },
};

const _securityReducer = createReducer(
  securityInitialState,
  on(updateSecurityFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
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
  })),
  on(updateSecurityTotal, (state, {payload}) => ({
    ...state,
    pagination: {
      ...state.pagination,
      total: payload.total,
    },
  })),
);

export function securityReducer(state: SecurityState | undefined, action: any) {
  return _securityReducer(state, action);
}
