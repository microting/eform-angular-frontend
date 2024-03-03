import {createSelector} from '@ngrx/store';
import {AppState} from '../';

export const selectPluginsState = (state: AppState) => state.plugins;
export const selectPluginsVisitedPlugins =
  createSelector(selectPluginsState, (state) => state.visitedPlugins);
