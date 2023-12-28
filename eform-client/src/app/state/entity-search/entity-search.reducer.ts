import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  updateEntitySearchFilters,
  updateEntitySearchPagination,
  updateEntitySearchTotal
} from './';

export interface EntitySearchState {
  pagination: CommonPaginationState;
  filters: EntitySearchFiltration;
  total: number;
}

export interface EntitySearchFiltration {
  nameFilter: string;
}

export const entitySearchInitialState: EntitySearchState = {
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

const _entitySearchReducer = createReducer(
  entitySearchInitialState,
  on(updateEntitySearchFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
    },
  })),
  on(updateEntitySearchPagination, (state, {payload}) => ({
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
  on(updateEntitySearchTotal, (state, {payload}) => ({
      ...state,
      total: payload.total,
      pagination: {
        ...state.pagination,
        total: payload.total,
      },
    }),
  ),
);

export function entitySearchReducer(state: EntitySearchState | undefined, action: any) {
  return _entitySearchReducer(state, action);
}
