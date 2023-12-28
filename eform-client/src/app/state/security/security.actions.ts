import {createAction} from '@ngrx/store';
import {SecurityFilters} from 'src/app/state';
import {CommonPaginationState} from 'src/app/common/models';

export const updateSecurityFilters = createAction(
  '[Security] Update Security Filters',
  (payload: { filters: SecurityFilters }) => ({payload})
);

export const updateSecurityPagination = createAction(
  '[Security] Update Security Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const updateSecurityTotal = createAction(
  '[Security] Update Security Total',
  (payload: { total: number }) => ({payload})
);
