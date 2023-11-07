import {AppState} from 'src/app/state/app.state';
import {createSelector} from '@ngrx/store';

export const selectSecurityState = (state: AppState) => state.security;
export const selectSecurityFilters =
  createSelector(selectSecurityState, (state) => state.filters);
export const selectSecurityNameFilter =
  createSelector(selectSecurityState, (state) => state.filters.nameFilter);
export const selectSecuritySort =
  createSelector(selectSecurityState, (state) => state.pagination.sort);
export const selectSecurityIsSortDsc =
  createSelector(selectSecurityState, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectSecurityPagination =
  createSelector(selectSecurityState, (state) => state.pagination);
