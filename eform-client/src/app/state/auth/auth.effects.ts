import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AdminService, AppSettingsService, AuthService} from 'src/app/common/services';
import {exhaustMap, of, catchError, map} from 'rxjs';
import {loadAuthFailure, loadAuthSuccess, refreshToken,} from 'src/app/state';
import {AuthResponseModel, OperationDataResult} from 'src/app/common/models';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions,
              private settingsService: AppSettingsService,
              private adminService: AdminService,
              private authService: AuthService) {
  }

  authenticate$ = createEffect(() => this.actions$.pipe(
    ofType('[Auth] Authenticate'),
    exhaustMap((action) => this.authService.login(action)
      .pipe(
        map((auth: any) => loadAuthSuccess(auth)),
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
            accessToken: auth.model.access_token,
            tokenType: auth.model.token_type,
            role: auth.model.role,
            expiresIn: auth.model.expires_in,
          },
          currentUser: {
            id: auth.model.id,
            userName: auth.model.userName,
            firstName: auth.model.firstName,
            lastName: auth.model.lastName,
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

}
