import {createAction} from '@ngrx/store';


export const authenticate = createAction(
  '[Auth] Authenticate',
  (payload: any) => ({payload})
);

export const refreshToken = createAction(
  '[Auth] Refresh Token',
  (payload: any) => ({payload})
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
  (payload: any) => ({payload})
);
export const updateSideMenuOpened = createAction(
  '[Auth] Update Side Menu Opened',
  (payload: any) => ({payload})
);
export const ConnectionStringExist = createAction(
  '[Auth] Connection String Exist',
  (payload: any) => ({payload})
);
export const ConnectionStringExistCount = createAction(
  '[Auth] Connection String Exist Count',
  (payload: any) => ({payload})
);
export const loadAuthSuccess = createAction(
  '[Auth] Authenticate Success',
  (payload: any) => ({payload})
);

export const loadAuthFailure = createAction(
  '[Auth] Authenticate Failure',
  (payload: any) => ({payload})
);
