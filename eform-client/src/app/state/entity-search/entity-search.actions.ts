import {createAction} from '@ngrx/store';
import {CommonPaginationState} from 'src/app/common/models';
import {EntitySearchFiltration} from 'src/app/state';

export const updateEntitySearchFilters = createAction(
  '[EntitySearch] Update EntitySearch Filters',
  (payload: { filters: EntitySearchFiltration }) => ({payload})
);

export const updateEntitySearchPagination = createAction(
  '[EntitySearch] Update EntitySearch Pagination',
  (payload: {pagination: CommonPaginationState}) => ({payload})
);

export const updateEntitySearchTotal = createAction(
  '[EntitySearch] Update EntitySearch Total',
  (payload: { total: number }) => ({payload})
);
