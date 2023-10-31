import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer} from '@ngrx/store';

export interface EmailRecipientsState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: EmailRecipientsState = {
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
  total: 0,
};

export const _emailRecipientsReducer = createReducer(
  initialState,
);

export function reducer(state: EmailRecipientsState | undefined, action: any) {
  return _emailRecipientsReducer(state, action);
}
