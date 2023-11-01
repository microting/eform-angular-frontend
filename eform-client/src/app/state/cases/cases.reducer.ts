import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  updateCasesFilters,
  updateCasesPagination
} from 'src/app/state/cases/cases.actions';

export interface CasesState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: CasesState = {
  pagination: {
    pageSize: 10,
    sort: 'Id',
    isSortDsc: false,
    offset: 0,
    total: 0,
    pageIndex: 0,
  },
  filters: {
    nameFilter: '',
    tagIds: [],
  },
  total: 0,
};

export const _casesReducer = createReducer(
  initialState,
  on(loadCases, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(loadCasesSuccess, (state, {payload}) => ({
    ...state,
    cases: payload.model,
    totalCount: payload.total,
    status: 'success',
  })),
  on(loadCasesFailure, (state, {payload}) => ({
    ...state,
    error: payload,
    status: 'error',
  })),
  on(updateCasesFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    },
  })),
  on(updateCasesPagination, (state, {payload}) => ({
    ...state,
    pagination: {
      offset: payload.pagination.offset,
      pageSize: payload.pagination.pageSize,
      pageIndex: payload.pagination.pageIndex,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      total: payload.pagination.total,
    },
  })));

export function reducer(state: CasesState | undefined, action: any) {
  return _casesReducer(state, action);
}
