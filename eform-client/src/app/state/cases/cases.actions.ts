import {createAction} from '@ngrx/store';

export const loadCases = createAction(
  '[Cases] Load Cases'
);

export const loadCasesSuccess = createAction(
  '[Cases] Load Cases Success',
  (payload: any) => ({payload})
);

export const loadCasesFailure = createAction(
  '[Cases] Load Cases Failure',
  (payload: any) => ({payload})
);

export const updateCasesFilters = createAction(
  '[Cases] Update Cases Filters',
  (payload: any) => ({payload})
);

export const updateCasesPagination = createAction(
  '[Cases] Update Cases Pagination',
  (payload: any) => ({payload})
);
