import {createAction} from '@ngrx/store';

export const updateEntitySelectFilters = createAction(
  '[EntitySelect] Update EntitySelect Filters',
  (payload: any) => ({payload})
);


export const updateEntitySelectPagination = createAction(
  '[EntitySelect] Update EntitySelect Pagination',
  (payload: any) => ({payload})
);

export const updateEntitySelectTotal = createAction(
  '[EntitySelect] Update EntitySelect Total',
  (payload: any) => ({payload})
);
