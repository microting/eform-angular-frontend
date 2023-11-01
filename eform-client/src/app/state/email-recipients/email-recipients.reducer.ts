import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  emailRecipientsUpdateFilters,
  emailRecipientsUpdatePagination, emailRecipientsUpdateTotal
} from 'src/app/state/email-recipients/email-recipients.actions';

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
  on(emailRecipientsUpdateFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    }
  })),
  on(emailRecipientsUpdatePagination, (state, {payload}) => ({
    ...state,
    pagination: {
      pageSize: payload.pagination.pageSize,
      pageIndex: payload.pagination.pageIndex,
      sort: payload.pagination.sort,
      isSortDsc: payload.pagination.isSortDsc,
      offset: payload.pagination.offset,
      total: payload.pagination.total,
    }})),
  on(emailRecipientsUpdateTotal, (state, {payload}) => ({
    ...state,
    total: payload.total,
    pagination: {
      ...state.pagination,
      total: payload.total,
    }})),
);

export function reducer(state: EmailRecipientsState | undefined, action: any) {
  return _emailRecipientsReducer(state, action);
}
