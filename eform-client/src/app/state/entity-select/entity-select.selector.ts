import {createSelector} from '@ngrx/store';
import {AppState, EntitySelectState} from '../';

export const selectEntitySelectState = (state: AppState) => state.entitySelect;
export const selectEntitySelectFilters =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.filters);

export const selectEntitySelectNameFilter =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.filters.nameFilter);
export const selectEntitySelectSort =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination.sort);
export const selectEntitySelectIsSortDsc =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectEntitySelectPagination =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination);
export const selectEntitySelectTotal =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.total);
export const selectEntitySelectOffset =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination.offset);
export const selectEntitySelectPageSize =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination.pageSize);
export const selectEntitySelectPageIndex =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.pagination.pageIndex);
