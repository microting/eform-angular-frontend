import {createAction} from '@ngrx/store';

export const emailRecipientsUpdateFilters = createAction(
  '[EmailRecipients] Update Filters',
  (payload: any) => ({payload})
);

export const emailRecipientsUpdatePagination = createAction(
  '[EmailRecipients] Update Pagination',
  (payload: any) => ({payload})
);

export const emailRecipientsUpdateTotal = createAction(
  '[EmailRecipients] Update Total',
  (payload: any) => ({payload})
);
