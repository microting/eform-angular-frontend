import {createAction} from '@ngrx/store';


export const authenticate = createAction(
  '[Auth] Authenticate',
  (payload: any) => ({payload})
);

export const refreshToken = createAction(
  '[Auth] Refresh Token',
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
