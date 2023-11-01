import {createAction} from '@ngrx/store';

export const updateSecurityFilters = createAction(
  '[Security] Update Security Filters',
  (payload: any) => ({payload})
);

export const updateSecurityPagination = createAction(
  '[Security] Update Security Pagination',
  (payload: any) => ({payload})
);

export const updateSecurityTotal = createAction(
  '[Security] Update Security Total',
  (payload: any) => ({payload})
);
