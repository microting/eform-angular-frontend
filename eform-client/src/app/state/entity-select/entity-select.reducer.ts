import {CommonPaginationState, FiltrationStateModel} from 'src/app/common/models';
import {createReducer, on} from '@ngrx/store';
import {updateEntitySelectFilters} from 'src/app/state/entity-select/entity-select.actions';

export interface EntitySelectState {
  pagination: CommonPaginationState;
  filters: FiltrationStateModel;
  total: number;
}

export const initialState: EntitySelectState = {
  pagination: {
    offset: 0,
    pageSize: 10000,
    pageIndex: 0,
    sort: 'Id',
    isSortDsc: false,
    total: 0,
  },
  filters: {
    nameFilter: '',
    tagIds: [],
  },
  total: 0,
}

export const _entitySelectReducer = createReducer(
  initialState,
  on(updateEntitySelectFilters, (state, {payload}) => ({
    ...state,
    filters: {
      nameFilter: payload.filters.nameFilter,
      tagIds: payload.filters.tagIds,
    },
  })),
);

export function reducer(state: EntitySelectState | undefined, action: any) {
  return _entitySelectReducer(state, action);
}
