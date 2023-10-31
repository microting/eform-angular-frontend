import {createSelector} from '@ngrx/store';
import {EntitySearchState} from 'src/app/state/entity-search/entity-search.reducer';

export const selectEntitySearchState = (state) => state.entitySearch;
export const selectEntitySearchFilters =
  createSelector(selectEntitySearchState, (state: EntitySearchState  ) => state.filters);

export const selectEntitySearchNameFilter =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.filters.nameFilter);
export const selectEntitySearchSort =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination.sort);
export const selectEntitySearchIsSortDsc =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectEntitySearchPagination =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination);
export const selectEntitySearchTotal =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.total);
export const selectEntitySearchOffset =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination.offset);
export const selectEntitySearchPageSize =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination.pageSize);
export const selectEntitySearchPageIndex =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.pagination.pageIndex);
export const selectEntitySearchTagIds =
  createSelector(selectEntitySearchState, (state: EntitySearchState) => state.filters.tagIds);
