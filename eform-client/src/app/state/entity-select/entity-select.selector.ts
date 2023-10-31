import {createSelector} from '@ngrx/store';
import {EntitySelectState} from 'src/app/state/entity-select/entity-select.reducer';

export const selectEntitySelectState = (state) => state.entitySelect;
export const selectEntitySelectFilters =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.filters);

export const selectEntitySelectNameFilter =
  createSelector(selectEntitySelectState, (state: EntitySelectState) => state.filters.nameFilter);
