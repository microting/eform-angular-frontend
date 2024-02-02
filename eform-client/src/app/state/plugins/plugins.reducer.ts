import {createReducer, on} from '@ngrx/store';
import {
  addPluginToVisited
} from './';

export interface PluginsState {
  visitedPlugins: string[];
}

export const pluginsInitialState: PluginsState = {
  visitedPlugins: [],
};

const _pluginsReducer = createReducer(
  pluginsInitialState,
  on(addPluginToVisited, (state, {payload}) => {
    if (state.visitedPlugins.findIndex(x => x === payload) === -1) {
      return {
        ...state,
        visitedPlugins: [...state.visitedPlugins, payload],
      };
    }
    return {
      ...state,
    };
  }),
);

export function pluginsReducer(state: PluginsState | undefined, action: any) {
  return _pluginsReducer(state, action);
}
