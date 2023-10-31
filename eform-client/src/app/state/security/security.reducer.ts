import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {Action, createReducer} from '@ngrx/store';

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
);

export function reducer(state: SecurityState | undefined, action: any) {
  return _securityReducer(state, action);
}
