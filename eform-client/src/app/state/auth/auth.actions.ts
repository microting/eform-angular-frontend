import {createAction} from '@ngrx/store';
import {
  OperationDataResult,
  UserClaimsModel,
  UserSettingsModel
} from 'src/app/common/models';
import {AuthCurrentUser, AuthState, AuthToken} from 'src/app/state';


export const authenticate = createAction(
  '[Auth] Authenticate',
  (payload: any) => ({payload})
);

export const refreshToken = createAction(
  '[Auth] Refresh Token',
);

export const updateUserLocale = createAction(
  '[Auth] Update User Locale',
  (payload: any) => ({payload})
);

export const updateCurrentUserLocaleAndDarkTheme = createAction(
  '[Auth] Update Current User Locale And Dark Theme',
  (payload: any) => ({payload})
);

export const updateDarkTheme = createAction(
  '[Auth] Update Dark Theme',
  (payload: any) => ({payload})
);

export const updateUserInfo = createAction(
  '[Auth] Update User Info',
  (payload: { userSettings: OperationDataResult<UserSettingsModel>, userClaims: UserClaimsModel }) => ({payload})
);

export const updateSideMenuOpened = createAction(
  '[Auth] Update Side Menu Opened',
  (payload: { sideMenuIsOpened: boolean }) => ({payload})
);

export const connectionStringExist = createAction(
  '[Auth] Connection String Exist',
  (payload: any) => ({payload})
);

export const connectionStringExistCount = createAction(
  '[Auth] Connection String Exist Count',
  (payload: { isConnectionStringExist: boolean, count: number }) => ({payload})
);

export const loadAuthSuccess = createAction(
  '[Auth] Authenticate Success',
  (payload: { token: AuthToken, currentUser: AuthCurrentUser, count: number }) => ({payload})
);

export const loadAuthFailure = createAction(
  '[Auth] Authenticate Failure',
  (payload: any) => ({payload})
);

export const loadAuthState = createAction(
  '[Auth] Load Auth State',
  (payload: { state: AuthState }) => ({payload})
);

export const logout = createAction(
  '[Auth] Logout',
);

export const browserReload = createAction(
  '[Auth] Browser Reload',
  (payload: any) => ({payload})
);
