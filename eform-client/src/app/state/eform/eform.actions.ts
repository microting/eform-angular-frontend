import {createAction} from '@ngrx/store';
import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';

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
  (payload: { filters: FiltrationStateModel }) => ({payload})
);

export const updateEformPagination = createAction(
  '[Eform] Update Eform Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);
