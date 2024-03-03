import {createAction} from '@ngrx/store';

export const addPluginToVisited = createAction(
  '[Plugins] Add Plugin to visited',
  (payload: string) => ({payload})
);
