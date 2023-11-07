import {createAction} from '@ngrx/store';

export const loadUsers = createAction(
  '[Users] Load Users'
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  (payload: any) => ({payload})
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  (payload: any) => ({payload})
);

export const updateUsersPagination = createAction(
  '[Users] Update Users Pagination',
  (payload: any) => ({payload})
);

export const updateUsersFilters = createAction(
  '[Users] Update Users Filters',
  (payload: any) => ({payload})
);
