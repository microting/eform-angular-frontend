import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  updateEntitySearchFilters,
  updateEntitySearchPagination, updateEntitySearchTotal
} from 'src/app/state/entity-search/entity-search.actions';

export interface EntitySearchState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: EntitySearchState = {
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
    tagIds: [],
  },
  total: 0,
}

export const _entitySearchReducer = createReducer(
  initialState,
  on(updateEntitySearchFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
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

export function reducer(state: EntitySearchState | undefined, action: any) {
  return _entitySearchReducer(state, action);
}
