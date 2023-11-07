import {createAction} from '@ngrx/store';

export const loadEforms = createAction(
  '[Eform] Load Eforms'
);

export const loadEformsSuccess = createAction(
  '[Eform] Load Eforms Success',
  (payload: any) => ({payload})
);

export const loadEformsFailure = createAction(
  '[Eform] Load Eforms Failure',
  (payload: any) => ({payload})
);

export const updateEformFilters = createAction(
  '[Eform] Update Eform Filters',
  (payload: any) => ({payload})
);

export const updateEformPagination = createAction(
  '[Eform] Update Eform Pagination',
  (payload: any) => ({payload})
);
