import {createSelector} from '@ngrx/store';
import {CasesState} from 'src/app/state/cases/cases.reducer';
import {AppState} from 'src/app/state/app.state';

export const selectCases = (state: AppState) => state.cases;
export const selectCasesTagIds =
  createSelector(selectCases, (state: CasesState) => state.filters.tagIds);
export const selectCasesNameFilter =
  createSelector(selectCases, (state: CasesState) => state.filters.nameFilter);
export const selectCasesSort =
  createSelector(selectCases, (state: CasesState) => state.pagination.sort);
export const selectCasesIsSortDsc =
  createSelector(selectCases, (state: CasesState) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectCasesPagination =
  createSelector(selectCases, (state: CasesState) => state.pagination);
export const selectCasesFilters =
  createSelector(selectCases, (state: CasesState) => state.filters);
