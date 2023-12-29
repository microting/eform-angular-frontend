import {createAction} from '@ngrx/store';
import {EntitySelectFilters} from 'src/app/state';
import {CommonPaginationState} from 'src/app/common/models';

export const updateEntitySelectFilters = createAction(
  '[EntitySelect] Update EntitySelect Filters',
  (payload: { filters: EntitySelectFilters }) => ({payload})
);

export const updateEntitySelectPagination = createAction(
  '[EntitySelect] Update EntitySelect Pagination',
  (payload: { pagination: CommonPaginationState }) => ({payload})
);

export const updateEntitySelectTotal = createAction(
  '[EntitySelect] Update EntitySelect Total',
  (payload: { total: number }) => ({payload})
);
