import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  loadEforms,
  loadEformsFailure,
  loadEformsSuccess,
  updateEformFilters,
  updateEformPagination
} from './';

export interface EformsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
}

export const eformsInitialState: EformsState = {
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
};

const _eformsReducer = createReducer(
  eformsInitialState,
  on(loadEforms, (state) => ({ // TODO it's work?
    ...state,
    status: 'loading',
  })),
  on(loadEformsSuccess, (state, {payload}) => ({ // TODO it's work?
    ...state,
    eforms: payload.model,
    totalCount: payload.total,
    status: 'success',
  })),
  on(loadEformsFailure, (state, {payload}) => ({ // TODO it's work?
    ...state,
    error: payload,
    status: 'error',
  })),
  on(updateEformFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    },
  })),
  on(updateEformPagination, (state, {payload}) => ({
    ...state,
    pagination: {
      offset: 0,
      pageSize: 10000,
      pageIndex: 0,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      total: payload.pagination.total,
    },
  }))
);

export function eformReducer(state: EformsState | undefined, action: any) {
  return _eformsReducer(state, action);
}
