import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  updateCasesFilters,
  updateCasesPagination
} from './';

export interface CasesState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const casesInitialState: CasesState = {
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

const _casesReducer = createReducer(
  casesInitialState,
  on(loadCases, (state) => ({ // TODO it's work?
    ...state,
    status: 'loading',
  })),
  on(loadCasesSuccess, (state, {payload}) => ({ // TODO it's work?
    ...state,
    cases: payload.model,
    totalCount: payload.total,
    status: 'success',
  })),
  on(loadCasesFailure, (state, {payload}) => ({ // TODO it's work?
    ...state,
    error: payload,
    status: 'error',
  })),
  on(updateCasesFilters, (state, {payload}) => ({
    ...state,
    filters: {
      ...state.filters,
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

export function casesReducer(state: CasesState | undefined, action: any) {
  return _casesReducer(state, action);
}
