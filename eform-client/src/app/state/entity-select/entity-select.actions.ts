import {createAction} from '@ngrx/store';

export const updateEntitySelectFilters = createAction(
  '[EntitySelect] Update EntitySelect Filters',
  (payload: any) => ({payload})
);
