import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  updateEntitySelectFilters,
  updateEntitySelectPagination,
  updateEntitySelectTotal
} from './';

export interface EntitySelectState {
  pagination: CommonPaginationState;
  filters: EntitySelectFilters;
  total: number;
}

export interface EntitySelectFilters {
  nameFilter: string;
}

export const entitySelectInitialState: EntitySelectState = {
  pagination: {
    offset: 0,
    pageSize: 10,
    pageIndex: 0,
    sort: 'Id',
    isSortDsc: false,
    total: 0,
  },
  filters: {
    nameFilter: '',
  },
  total: 0,
};

const _entitySelectReducer = createReducer(
  entitySelectInitialState,
  on(updateEntitySelectFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
    },
  })),
  on(updateEntitySelectPagination, (state, {payload}) => ({
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
  on(updateEntitySelectTotal, (state, {payload}) => ({
      ...state,
      total: payload.total,
      pagination: {
        ...state.pagination,
        total: payload.total,
      },
    }),
  ),
);

export function entitySelectReducer(state: EntitySelectState | undefined, action: any) {
  return _entitySelectReducer(state, action);
}
