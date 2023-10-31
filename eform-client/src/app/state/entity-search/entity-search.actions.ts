import {createAction} from '@ngrx/store';

export const updateEntitySearchFilters = createAction(
  '[EntitySearch] Update EntitySearch Filters',
  (payload: any) => ({payload})
);

export const updateEntitySearchPagination = createAction(
  '[EntitySearch] Update EntitySearch Pagination',
  (payload: any) => ({payload})
);

export const updateEntitySearchTotal = createAction(
  '[EntitySearch] Update EntitySearch Total',
  (payload: any) => ({payload})
);
