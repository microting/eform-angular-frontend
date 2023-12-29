import {CommonPaginationState} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {
  emailRecipientsUpdateFilters,
  emailRecipientsUpdatePagination,
  emailRecipientsUpdateTotal
} from './';

export interface EmailRecipientsState {
  pagination: CommonPaginationState;
  filters: EmailRecipientsFilters;
  total: number;
}

export interface EmailRecipientsFilters {
  tagIds: number[],
}

export const emailRecipientsInitialState: EmailRecipientsState = {
  pagination: {
    offset: 0,
    pageSize: 10,
    pageIndex: 0,
    sort: 'Id',
    isSortDsc: false,
    total: 0,
  },
  filters: {
    tagIds: [],
  },
  total: 0,
};

const _emailRecipientsReducer = createReducer(
  emailRecipientsInitialState,
  on(emailRecipientsUpdateFilters, (state, {payload}) => ({
    ...state,
    filters: {
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

export function emailRecipientsReducer(state: EmailRecipientsState | undefined, action: any) {
  return _emailRecipientsReducer(state, action);
}
