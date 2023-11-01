import {AppState} from 'src/app/state/app.state';
import {createSelector} from '@ngrx/store';

export const emailRecipientsState = (state: AppState) => state.emailRecipients;
export const selectEmailRecipientsFilters =
  createSelector(emailRecipientsState, (state) => state.filters);
export const selectEmailRecipientsSort =
  createSelector(emailRecipientsState, (state) => state.pagination.sort);
export const selectEmailRecipientsIsSortDsc =
  createSelector(emailRecipientsState, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectEmailRecipientsPagination =
  createSelector(emailRecipientsState, (state) => state.pagination);
export const selectEmailRecipientsTagIds =
  createSelector(emailRecipientsState, (state) => state.filters.tagIds);
