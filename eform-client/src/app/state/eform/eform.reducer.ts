import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  loadEforms,
  loadEformsFailure,
  loadEformsSuccess,
  updateEformFilters,
  updateEformPagination
} from 'src/app/state/eform/eform.actions';

export interface EformsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
}

export const initialState: EformsState = {
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

export const _eformsReducer = createReducer(
  initialState,
  on(loadEforms, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(loadEformsSuccess, (state, {payload}) => ({
    ...state,
    eforms: payload.model,
    totalCount: payload.total,
    status: 'success',
    })),
  on(loadEformsFailure, (state, {payload}) => ({
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

export function reducer(state: EformsState | undefined, action: any) {
  return _eformsReducer(state, action);
}
