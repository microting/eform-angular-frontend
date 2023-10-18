import {createSelector} from '@ngrx/store';
import {AuthState} from 'src/app/state/auth/auth.recuder';

export const selectAuth = (state) => state.authV2;
export const selectAuthIsAuth = createSelector(selectAuth, (state: AuthState) => state.token.accessToken !== '');
export const selectBearerToken = createSelector(selectAuth, (state: AuthState) => state.token.accessToken);
export const selectAuthUser = createSelector(selectAuth, (state: AuthState) => state.currentUser);
export const selectAuthError = createSelector(selectAuth, (state: AuthState) => state.error);

export const selectLoginRedirectUrl = createSelector(selectAuth, (state: AuthState) => state.currentUser.loginRedirectUrl);

