import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AdminService, AppSettingsService, AuthService} from 'src/app/common/services';
import {exhaustMap, of, catchError, map} from 'rxjs';
import {authenticate, loadAuthFailure, loadAuthState, loadAuthSuccess, refreshToken,} from 'src/app/state';
import {AuthResponseModel, OperationDataResult} from 'src/app/common/models';
import {AuthStateService} from 'src/app/common/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private settingsService: AppSettingsService,
    private adminService: AdminService,
    private authService: AuthService,
    private authStateService: AuthStateService,
  ) {
  }

  authenticate$ = createEffect(() => this.actions$.pipe(
      ofType(authenticate),
      exhaustMap((action) => this.authService.login(action.payload)
        .pipe(
          map((auth: AuthResponseModel) => loadAuthSuccess({
            token: {
              accessToken: auth.accessToken,
              tokenType: auth.tokenType,
              role: auth.role,
              expiresIn: auth.expiresIn,
            },
            currentUser: {
              id: auth.id,
              userName: auth.userName,
              firstName: auth.firstName,
              lastName: auth.lastName,
              isFirstUser: auth.isFirstUser,
            },
            count: 2,
          })),
          catchError((error: any) => of(loadAuthFailure(error)))
        ))
    )
  );

  refreshToken$ = createEffect(() => this.actions$.pipe(
      ofType(refreshToken),
      exhaustMap((action) => this.authService.refreshToken()
        .pipe(
          map((auth: OperationDataResult<AuthResponseModel>) => (loadAuthSuccess({
            token: {
              accessToken: auth.model.accessToken,
              tokenType: auth.model.tokenType,
              role: auth.model.role,
              expiresIn: auth.model.expiresIn,
            },
            currentUser: {
              id: auth.model.id,
              userName: auth.model.userName,
              firstName: auth.model.firstName,
              lastName: auth.model.lastName,
              isFirstUser: auth.model.isFirstUser,
            },
            count: 2,
          }))),
          catchError((error: any) => of(loadAuthFailure(error)))
        ))
    )
  );

  updateConnectionString$ = createEffect(() => this.actions$.pipe(
      ofType('[Auth] Update Connection String'),
      exhaustMap((action) => this.settingsService.updateConnectionString(action)
        .pipe(
          map((auth: any) => ({type: '[Auth] Update Connection String Success', payload: auth})),
          catchError((error: any) => of({type: '[Auth] Update Connection String Failure', payload: error}))
        ))
    )
  );

  loadUserInformation$ = createEffect(() => this.actions$.pipe(
      ofType('[Auth] Load User Information'),
      exhaustMap(() => this.adminService.getCurrentUserInfo()
        .pipe(
          map((auth: any) => ({type: '[Auth] Load User Information Success', payload: auth})),
          catchError((error: any) => of({type: '[Auth] Load User Information Failure', payload: error}))
        ))
    )
  );
  /*after load token from localStorage check expireIn toke and if tokes is expire - refresh token.
  loadAuthState need run before ALL app and one time*/
  loadAuthState$ = createEffect(() => this.actions$.pipe(
    ofType(loadAuthState),
    exhaustMap((action) => {
      if (
        action.payload &&
        action.payload.state &&
        action.payload.state.token &&
        action.payload.state.token.expiresIn &&
        action.payload.state.token.expiresIn > new Date()
      ) {
        return this.authService.refreshToken().pipe(
          map((auth: OperationDataResult<AuthResponseModel>) => (loadAuthSuccess({
            token: {
              accessToken: auth.model.accessToken,
              tokenType: auth.model.tokenType,
              role: auth.model.role,
              expiresIn: auth.model.expiresIn,
            },
            currentUser: {
              id: auth.model.id,
              userName: auth.model.userName,
              firstName: auth.model.firstName,
              lastName: auth.model.lastName,
              isFirstUser: auth.model.isFirstUser,
            },
            count: 2,
          }))),
          catchError((error: any) => {
            this.authStateService.logout();
            return of(loadAuthFailure(error));
          }));
      }
    })
  ));

}
