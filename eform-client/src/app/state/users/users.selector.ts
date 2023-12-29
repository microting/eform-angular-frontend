import {AppState} from 'src/app/state';
import {createSelector} from '@ngrx/store';

export const selectUsers = (state: AppState) => state.users;
export const selectUsersTotalUsers = createSelector(selectUsers, (state) => state.total);
export const selectUsersPagination = createSelector(selectUsers, (state) => state.pagination);
export const selectUsersSort = createSelector(selectUsers, (state) => state.pagination.sort);
export const selectUsersIsSortDsc = createSelector(selectUsers, (state) => state.pagination.isSortDsc ? 'desc' : 'asc');
export const selectUsersOffset = createSelector(selectUsers, (state) => state.pagination.offset);
export const selectUsersPageSize = createSelector(selectUsers, (state) => state.pagination.pageSize);
export const selectUsersPageIndex = createSelector(selectUsers, (state) => state.pagination.pageIndex);
