import {EformsState} from 'src/app/state/eform/eform.reducer';
import {createSelector} from '@ngrx/store';

export const selectEforms = (state) => state.eforms;
export const selectEformsTagIds =
  createSelector(selectEforms, (state: EformsState) => state.filters.tagIds);
export const selectEformsNameFilter =
  createSelector(selectEforms, (state: EformsState) => state.filters.nameFilter);
export const selectEformsSort =
  createSelector(selectEforms, (state: EformsState) => state.pagination.sort);
export const selectEformsIsSortDsc =
  createSelector(selectEforms, (state: EformsState) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectEformsPagination =
  createSelector(selectEforms, (state: EformsState) => state.pagination);
export const selectEformsFilters =
  createSelector(selectEforms, (state: EformsState) => state.filters);
