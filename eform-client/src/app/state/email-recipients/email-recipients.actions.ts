import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';
import {EmailRecipientsFilters} from '../';

export const emailRecipientsUpdateFilters = createAction(
  '[EmailRecipients] Update Filters',
  (payload: { filters: EmailRecipientsFilters }) => ({payload})
);

export const emailRecipientsUpdatePagination = createAction(
  '[EmailRecipients] Update Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const emailRecipientsUpdateTotal = createAction(
  '[EmailRecipients] Update Total',
  (payload: { total: number }) => ({payload})
);
