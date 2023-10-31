import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  updateEntitySelectFilters,
  updateEntitySelectPagination, updateEntitySelectTotal
} from 'src/app/state/entity-select/entity-select.actions';

export interface EntitySelectState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: EntitySelectState = {
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

export const _entitySelectReducer = createReducer(
  initialState,
  on(updateEntitySelectFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
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

export function reducer(state: EntitySelectState | undefined, action: any) {
  return _entitySelectReducer(state, action);
}
